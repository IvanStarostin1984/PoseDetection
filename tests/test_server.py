from typing import Any
from backend.server import build_payload
import sys
import subprocess
import time
import asyncio
from types import SimpleNamespace


def test_build_payload_format():
    lms = {
        "hip": {"x": 0.1, "y": 0.2},
        "knee": {"x": 0.3, "y": 0.4},
        "ankle": {"x": 0.5, "y": 0.6},
        "left_hip": {"x": 0.1, "y": 0.2},
        "right_hip": {"x": 0.2, "y": 0.2},
    }
    payload = build_payload(lms)
    assert isinstance(payload["landmarks"], list)
    assert payload["landmarks"][0] == {"x": 0.1, "y": 0.2}
    metrics = payload["metrics"]
    assert {"knee_angle", "balance", "pose_class"} <= metrics.keys()


def test_server_starts():
    proc = subprocess.Popen(
        [sys.executable, "-m", "backend.server"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    try:
        time.sleep(1)
        assert proc.poll() is None
    finally:
        proc.terminate()
        proc.wait(timeout=5)


class DummyWS:
    def __init__(self):
        self.accepted = False
        self.sent: list[str] = []

    async def accept(self) -> None:
        self.accepted = True

    async def send_text(self, text: str) -> None:
        self.sent.append(text)


class DummyPose:
    def __init__(self) -> None:
        self.closed = False

    def process(self, image: Any) -> SimpleNamespace:
        return SimpleNamespace(pose_landmarks=None)

    def close(self) -> None:
        self.closed = True


class DummyCap:
    def __init__(self) -> None:
        self.released = False

    def read(self) -> tuple[bool, None]:
        return False, None

    def release(self) -> None:
        self.released = True


def test_pose_endpoint_closes_pose(monkeypatch):
    import backend.server as server

    pose = DummyPose()
    cap = DummyCap()
    monkeypatch.setattr(server, "mp_pose", pose)
    monkeypatch.setattr(server.cv2, "VideoCapture", lambda *_args, **_kw: cap)
    ws = DummyWS()
    asyncio.run(server.pose_endpoint(ws))
    assert cap.released is True
    assert pose.closed is True
