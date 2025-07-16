from typing import Any
from backend.server import build_payload
import sys
import subprocess
import time
import asyncio


def test_build_payload_format():
    lms = [{"x": 0.1, "y": 0.2, "visibility": 0.9}] * 17
    payload = build_payload(lms)
    assert isinstance(payload["landmarks"], list)
    assert len(payload["landmarks"]) == 17
    assert payload["landmarks"][0]["x"] == 0.1
    metrics = payload["metrics"]
    assert {"knee_angle", "balance", "pose_class"} <= metrics.keys()


def test_names_match_landmarks():
    import backend.server as server

    expected = [
        "nose",
        "left_eye",
        "right_eye",
        "left_ear",
        "right_ear",
        "left_shoulder",
        "right_shoulder",
        "left_elbow",
        "right_elbow",
        "left_wrist",
        "right_wrist",
        "left_hip",
        "right_hip",
        "left_knee",
        "right_knee",
        "left_ankle",
        "right_ankle",
    ]
    assert server._NAMES == expected


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

    def process(self, image: Any) -> list[Any]:
        return []

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
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: pose)
    monkeypatch.setattr(server.cv2, "VideoCapture", lambda *_args, **_kw: cap)
    ws = DummyWS()
    asyncio.run(server.pose_endpoint(ws))
    assert cap.released is True
    assert pose.closed is True


def test_pose_endpoint_allows_second_connection(monkeypatch):
    import backend.server as server

    poses: list[DummyPose] = [DummyPose(), DummyPose()]
    first_pose = poses[0]
    second_pose = poses[1]
    cap = DummyCap()

    def make_pose(*_a, **_k) -> DummyPose:
        return poses.pop(0)

    monkeypatch.setattr(server, "PoseDetector", make_pose)
    monkeypatch.setattr(server.cv2, "VideoCapture", lambda *_args, **_kw: cap)
    ws = DummyWS()

    asyncio.run(server.pose_endpoint(ws))
    assert cap.released is True
    assert first_pose.closed is True

    cap.released = False
    ws.sent.clear()

    asyncio.run(server.pose_endpoint(ws))
    assert cap.released is True
    assert second_pose.closed is True
