from __future__ import annotations
import asyncio
import json
import struct
import time
from typing import Any

import numpy as np
import pytest

import backend.server as server


class SlowPose:
    def __init__(self, sleep_ms: float) -> None:
        self.sleep_s = sleep_ms / 1000.0

    def process(self, frame: Any) -> list[dict[str, float]]:
        time.sleep(self.sleep_s)
        return [{"x": 0.0, "y": 0.0, "visibility": 1.0}] * 17

    def close(self) -> None:
        pass


class QueueWS:
    def __init__(self) -> None:
        self.accepted = False
        self.sent: list[str] = []
        self.queue: asyncio.Queue[bytes | None] = asyncio.Queue()

    async def accept(self) -> None:
        self.accepted = True

    async def receive_bytes(self) -> bytes:
        data = await self.queue.get()
        if data is None:
            raise server.WebSocketDisconnect()
        return data

    async def send_text(self, text: str) -> None:
        self.sent.append(text)

    async def close(self) -> None:
        pass


async def _slow_process(det: SlowPose, frame: Any) -> list[dict[str, float]]:
    return det.process(frame)


async def _run_sim(duration: float, infer_ms: float, encode_ms: float) -> float:
    monkeypatch = pytest.MonkeyPatch()
    monkeypatch.setattr(
        server,
        "PoseDetector",
        lambda *_a, **_k: SlowPose(infer_ms),
    )
    monkeypatch.setattr(server, "_process", _slow_process)
    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    _, buf = server.cv2.imencode(".jpg", frame)
    header = struct.pack("<dHH", 0.0, 1, 1)
    ws = QueueWS()
    server_task = asyncio.create_task(server.pose_endpoint(ws))
    await ws.queue.put(header + buf.tobytes())
    send_times = [time.perf_counter()]
    recv_idx = 0
    start = time.perf_counter()
    try:
        while time.perf_counter() - start < duration:
            while len(ws.sent) <= recv_idx:
                await asyncio.sleep(0.001)
            metrics = json.loads(ws.sent[recv_idx])["metrics"]
            infer_ms_val = float(metrics.get("infer_ms", 0))
            elapsed = time.perf_counter() - send_times[-1]
            target = (infer_ms_val + encode_ms + 5) / 1000.0
            await asyncio.sleep(max(0.0, target - elapsed))
            await ws.queue.put(header + buf.tobytes())
            send_times.append(time.perf_counter())
            recv_idx += 1
    finally:
        await ws.queue.put(None)
        await server_task
        monkeypatch.undo()
    return (len(send_times) - 1) / (send_times[-1] - send_times[0])


def test_client_fps_stabilises() -> None:
    fps = asyncio.run(_run_sim(10.0, 25.0, 5.0))
    assert fps >= 22.0
