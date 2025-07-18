import asyncio
from typing import Any

import numpy as np

import backend.server as server


class DummyWS:
    def __init__(self) -> None:
        self.accepted = False
        self.sent: list[str] = []
        self.closed = False

    async def accept(self) -> None:
        self.accepted = True

    async def send_text(self, text: str) -> None:
        self.sent.append(text)

    async def close(self) -> None:
        self.closed = True


class DummyPose:
    def __init__(self) -> None:
        self.closed = False

    def process(self, frame: Any) -> list[dict[str, float]]:
        return [{"x": 0.0, "y": 0.0, "visibility": 1.0}] * 17

    def close(self) -> None:
        self.closed = True


class DummyCap:
    def __init__(self) -> None:
        self.released = False
        self.calls = 0

    def read(self) -> tuple[bool, Any]:
        self.calls += 1
        if self.calls == 1:
            return True, np.zeros((1, 1, 3), dtype=np.uint8)
        return False, None

    def release(self) -> None:
        self.released = True

    def isOpened(self) -> bool:
        return True


def test_pose_endpoint_reads_frame(monkeypatch: Any) -> None:
    cap = DummyCap()
    pose = DummyPose()
    monkeypatch.setattr(server.cv2, "VideoCapture", lambda *_a, **_k: cap)
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: pose)

    ws = DummyWS()
    asyncio.run(server.pose_endpoint(ws))

    assert cap.calls >= 1
    assert ws.closed is True
    assert pose.closed is True
