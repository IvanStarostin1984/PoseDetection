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
    assert {"knee_angle", "balance", "pose_class", "posture_angle"} <= metrics.keys()


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


def test_root_mount_present():
    import backend.server as server
    from fastapi.staticfiles import StaticFiles

    for route in server.app.routes:
        if getattr(route, "path", None) in ("/", "") and hasattr(route, "app"):
            if isinstance(getattr(route, "app"), StaticFiles):
                break
    else:
        raise AssertionError("root mount not found")


class DummyWS:
    def __init__(self):
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


def test_pose_endpoint_allows_concurrent_connections(monkeypatch):
    import backend.server as server

    poses = [DummyPose(), DummyPose()]
    caps = [DummyCap(), DummyCap()]
    first_pose, second_pose = poses
    first_cap, second_cap = caps

    def make_pose(*_a, **_k) -> DummyPose:
        return poses.pop(0)

    def make_cap(*_a, **_k) -> DummyCap:
        return caps.pop(0)

    monkeypatch.setattr(server, "PoseDetector", make_pose)
    monkeypatch.setattr(server.cv2, "VideoCapture", make_cap)

    ws1 = DummyWS()
    ws2 = DummyWS()

    async def run() -> None:
        await asyncio.wait_for(
            asyncio.gather(server.pose_endpoint(ws1), server.pose_endpoint(ws2)),
            timeout=1,
        )

    asyncio.run(run())
    assert first_cap.released and second_cap.released
    assert first_pose.closed and second_pose.closed
    assert ws1.sent and ws2.sent


def test_pose_endpoint_handles_no_frame(monkeypatch):
    import backend.server as server

    class Cap(DummyCap):
        def read(self) -> tuple[bool, None]:
            return False, None

    pose = DummyPose()
    cap = Cap()
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: pose)
    monkeypatch.setattr(server.cv2, "VideoCapture", lambda *_a, **_k: cap)
    ws = DummyWS()

    asyncio.run(server.pose_endpoint(ws))
    assert ws.sent == ['{"error": "no frame"}']
    assert ws.closed is True


def test_pose_endpoint_handles_process_exception(monkeypatch):
    import backend.server as server

    class FailingPose(DummyPose):
        def process(self, image: Any) -> list[Any]:
            raise RuntimeError("boom")

    class Cap(DummyCap):
        def read(self) -> tuple[bool, None]:
            return True, None

    cap = Cap()
    pose = FailingPose()
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: pose)
    monkeypatch.setattr(server.cv2, "VideoCapture", lambda *_a, **_k: cap)
    ws = DummyWS()

    asyncio.run(server.pose_endpoint(ws))
    assert ws.sent == ['{"error": "process failed"}']
    assert ws.closed is True


def test_pose_endpoint_reports_no_landmarks(monkeypatch):
    import backend.server as server

    class PoseNoLandmarks(DummyPose):
        def process(self, image: Any) -> list[Any]:
            return []

    class Cap(DummyCap):
        def __init__(self):
            super().__init__()
            self.calls = 0

        def read(self) -> tuple[bool, None]:
            self.calls += 1
            if self.calls == 1:
                return True, None
            return False, None

    pose = PoseNoLandmarks()
    cap = Cap()
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: pose)
    monkeypatch.setattr(server.cv2, "VideoCapture", lambda *_a, **_k: cap)
    ws = DummyWS()

    asyncio.run(server.pose_endpoint(ws))
    assert ws.sent[0] == '{"error": "no landmarks"}'
    assert ws.closed is True
    assert len(ws.sent) == 2


def test_pose_endpoint_handles_client_disconnect(monkeypatch):
    import backend.server as server

    class Pose(DummyPose):
        def process(self, image: Any) -> list[Any]:
            return [{"x": 0.0, "y": 0.0}] * 17

    class Cap(DummyCap):
        def read(self) -> tuple[bool, None]:
            return True, None

    class DisconnectWS(DummyWS):
        async def send_text(self, text: str) -> None:
            raise server.WebSocketDisconnect()

    pose = Pose()
    cap = Cap()
    ws = DisconnectWS()
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: pose)
    monkeypatch.setattr(server.cv2, "VideoCapture", lambda *_a, **_k: cap)

    asyncio.run(server.pose_endpoint(ws))
    assert cap.released is True
    assert pose.closed is True
    assert ws.closed is True
