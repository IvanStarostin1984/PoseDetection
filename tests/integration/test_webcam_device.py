import asyncio
from typing import Any

import numpy as np
import struct

import json
import backend.server as server


class DummyWS:
    def __init__(self, frames: list[bytes]) -> None:
        self.accepted = False
        self.sent: list[str] = []
        self.frames = frames
        self.idx = 0

    async def accept(self) -> None:
        self.accepted = True

    async def receive_bytes(self) -> bytes:
        if self.idx >= len(self.frames):
            raise server.WebSocketDisconnect()
        data = self.frames[self.idx]
        self.idx += 1
        return data

    async def send_text(self, text: str) -> None:
        self.sent.append(text)

    async def close(self) -> None:
        pass


class DummyPose:
    def __init__(self) -> None:
        self.closed = False

    def process(self, frame: Any) -> list[dict[str, float]]:
        return [{"x": 0.0, "y": 0.0, "visibility": 1.0}] * 17

    def close(self) -> None:
        self.closed = True


def test_pose_endpoint_reads_frame(monkeypatch: Any) -> None:
    pose = DummyPose()
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: pose)
    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    _, buf = server.cv2.imencode(".jpg", frame)
    header = struct.pack("<dHH", 0.0, 1, 1)
    ws = DummyWS([header + buf.tobytes()])
    asyncio.run(server.pose_endpoint(ws))

    assert ws.sent
    msg = json.loads(ws.sent[0])
    assert "metrics" in msg
    assert pose.closed is True


def test_pose_endpoint_sanitizes_missing_data(monkeypatch: Any) -> None:
    class Pose(DummyPose):
        def process(self, frame: Any) -> list[dict[str, float]]:
            return [{"x": 0.0, "y": 0.0, "visibility": 0.0}] * 17

    pose = Pose()
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: pose)
    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    _, buf = server.cv2.imencode(".jpg", frame)
    header = struct.pack("<dHH", 0.0, 1, 1)
    ws = DummyWS([header + buf.tobytes()])
    asyncio.run(server.pose_endpoint(ws))

    data = json.loads(ws.sent[0])
    assert data["metrics"]["knee_angle"] is None
