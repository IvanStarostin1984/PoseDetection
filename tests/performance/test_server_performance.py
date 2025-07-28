import asyncio
import time
from typing import Any
import numpy as np
import json
import struct

import backend.server as server


class DummyDetector:
    def process(self, frame: Any) -> list[dict[str, float]]:
        return [{"x": 0.0, "y": 0.0, "visibility": 1.0}] * 17

    def close(self) -> None:
        pass


class DummyWS:
    def __init__(
        self, frames: list[bytes], recv_times: list[float], send_times: list[float]
    ) -> None:
        self.accepted = False
        self.sent: list[str] = []
        self.recv_times = recv_times
        self.send_times = send_times
        self.frames = frames
        self.idx = 0
        self.closed = False

    async def accept(self) -> None:
        self.accepted = True

    async def receive_bytes(self) -> bytes:
        if self.idx >= len(self.frames):
            raise server.WebSocketDisconnect()
        self.recv_times.append(time.perf_counter())
        data = self.frames[self.idx]
        self.idx += 1
        return data

    async def send_text(self, text: str) -> None:
        self.sent.append(text)
        self.send_times.append(time.perf_counter())

    async def close(self) -> None:
        self.closed = True


async def _dummy_process(det: DummyDetector, frame: Any) -> list[dict[str, float]]:
    return det.process(frame)


def test_pose_endpoint_performance(monkeypatch: Any) -> None:
    frame_count = 10
    recv_times: list[float] = []
    send_times: list[float] = []

    monkeypatch.setattr(server, "_process", _dummy_process)
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: DummyDetector())

    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    _, buf = server.cv2.imencode(".jpg", frame)
    header = struct.pack("<dHH", 0.0, 1, 1)
    frames = [header + buf.tobytes()] * frame_count

    ws = DummyWS(frames, recv_times, send_times)
    asyncio.run(server.pose_endpoint(ws))

    assert len(ws.sent) == frame_count
    assert len(recv_times) == frame_count

    for msg in ws.sent:
        metrics = json.loads(msg)["metrics"]
        assert "fps" in metrics
        assert "infer_ms" in metrics
        assert "json_ms" in metrics
        assert "cpu_percent" in metrics
        assert "rss_bytes" in metrics

    durations = [send_times[i] - recv_times[i] for i in range(frame_count)]
    avg_loop = sum(durations) / frame_count
    assert avg_loop <= 0.05
    assert max(durations) < 0.2
