from typing import Any
from backend.server import build_payload
import backend.server as server
import numpy as np
import sys
import subprocess
import time
import asyncio
import json
import struct


def test_build_payload_format():
    lms = [{"x": 0.1, "y": 0.2, "visibility": 0.9}] * 17
    payload = build_payload(lms, 30.0)
    assert isinstance(payload["landmarks"], list)
    assert len(payload["landmarks"]) == 17
    assert payload["landmarks"][0]["x"] == 0.1
    metrics = payload["metrics"]
    assert {
        "knee_angle",
        "balance",
        "pose_class",
        "posture_angle",
    } <= metrics.keys()
    assert "fps" in metrics
    assert "cpu_percent" in metrics
    assert "rss_bytes" in metrics
    assert payload["model"] in ("lite", "full")


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


def test_pose_route_before_static_mount():
    import backend.server as server
    from fastapi.staticfiles import StaticFiles

    pose_idx = static_idx = None
    for idx, route in enumerate(server.app.routes):
        if getattr(route, "path", None) == "/pose":
            pose_idx = idx
        if getattr(route, "path", None) in ("/", "") and hasattr(route, "app"):
            if isinstance(getattr(route, "app"), StaticFiles):
                static_idx = idx
    assert pose_idx is not None and static_idx is not None
    assert pose_idx < static_idx


class DummyWS:
    def __init__(self, frames: list[bytes] | None = None) -> None:
        self.accepted = False
        self.sent: list[str] = []
        self.closed = False
        self._frames = frames or []
        self._idx = 0

    async def accept(self) -> None:
        self.accepted = True

    async def receive_bytes(self) -> bytes:
        if self._idx >= len(self._frames):
            raise server.WebSocketDisconnect()
        data = self._frames[self._idx]
        self._idx += 1
        return data

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


def test_pose_endpoint_closes_pose(monkeypatch):
    pose = DummyPose()
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: pose)
    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    _, buf = server.cv2.imencode(".jpg", frame)
    ws = DummyWS([buf.tobytes()])

    asyncio.run(server.pose_endpoint(ws))

    assert pose.closed is True


def test_pose_endpoint_allows_second_connection(monkeypatch):
    poses: list[DummyPose] = [DummyPose(), DummyPose()]
    first_pose, second_pose = poses

    def make_pose(*_a, **_k) -> DummyPose:
        return poses.pop(0)

    monkeypatch.setattr(server, "PoseDetector", make_pose)
    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    _, buf = server.cv2.imencode(".jpg", frame)

    ws = DummyWS([buf.tobytes()])
    asyncio.run(server.pose_endpoint(ws))
    assert first_pose.closed is True

    ws = DummyWS([buf.tobytes()])
    asyncio.run(server.pose_endpoint(ws))
    assert second_pose.closed is True


def test_pose_endpoint_allows_concurrent_connections(monkeypatch):
    poses = [DummyPose(), DummyPose()]
    first_pose, second_pose = poses

    def make_pose(*_a, **_k) -> DummyPose:
        return poses.pop(0)

    monkeypatch.setattr(server, "PoseDetector", make_pose)
    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    _, buf = server.cv2.imencode(".jpg", frame)

    ws1 = DummyWS([buf.tobytes()])
    ws2 = DummyWS([buf.tobytes()])

    async def run() -> None:
        await asyncio.wait_for(
            asyncio.gather(server.pose_endpoint(ws1), server.pose_endpoint(ws2)),
            timeout=1,
        )

    asyncio.run(run())
    assert first_pose.closed and second_pose.closed
    assert ws1.sent and ws2.sent


def test_pose_endpoint_handles_process_exception(monkeypatch):
    class FailingPose(DummyPose):
        def process(self, image: Any) -> list[Any]:
            raise RuntimeError("boom")

    pose = FailingPose()
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: pose)
    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    _, buf = server.cv2.imencode(".jpg", frame)
    ws = DummyWS([buf.tobytes()])

    asyncio.run(server.pose_endpoint(ws))
    assert ws.sent == ['{"error": "process failed"}']


def test_pose_endpoint_reports_no_landmarks(monkeypatch):
    class PoseNoLandmarks(DummyPose):
        def process(self, image: Any) -> list[Any]:
            return []

    pose = PoseNoLandmarks()
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: pose)
    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    _, buf = server.cv2.imencode(".jpg", frame)
    ws = DummyWS([buf.tobytes()])

    asyncio.run(server.pose_endpoint(ws))
    assert ws.sent == ['{"error": "no landmarks"}']


def test_pose_endpoint_handles_client_disconnect(monkeypatch):
    class Pose(DummyPose):
        def process(self, image: Any) -> list[Any]:
            return [{"x": 0.0, "y": 0.0}] * 17

    class DisconnectWS(DummyWS):
        async def send_text(self, text: str) -> None:
            raise server.WebSocketDisconnect()

    pose = Pose()
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: pose)
    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    _, buf = server.cv2.imencode(".jpg", frame)
    ws = DisconnectWS([buf.tobytes()])

    asyncio.run(server.pose_endpoint(ws))
    assert pose.closed is True


def test_fps_metric_updates(monkeypatch):
    class Pose(DummyPose):
        def process(self, image: Any) -> list[Any]:
            return [{"x": 0.0, "y": 0.0}] * 17

    times = [
        1.0,  # initial last_time
        1.01,  # ts_recv 1
        1.02,  # start_infer 1
        1.04,  # end_infer 1
        1.10,  # now 1
        1.12,  # start_json 1
        1.14,  # end_json 1
        1.16,  # ts_out 1
        1.20,  # ts_recv 2
        1.22,  # start_infer 2
        1.24,  # end_infer 2
        1.30,  # now 2
        1.32,  # start_json 2
        1.34,  # end_json 2
        1.36,  # ts_out 2
    ]

    def fake_perf_counter() -> float:
        return times.pop(0)

    monkeypatch.setattr(server.time, "perf_counter", fake_perf_counter)
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: Pose())
    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    _, buf = server.cv2.imencode(".jpg", frame)
    ws = DummyWS([buf.tobytes(), buf.tobytes()])

    asyncio.run(server.pose_endpoint(ws))

    payloads = [json.loads(msg) for msg in ws.sent]
    fps_values = [p["metrics"]["fps"] for p in payloads]
    assert len(fps_values) == 2
    assert abs(fps_values[0] - 10.0) < 1e-6
    assert abs(fps_values[1] - 5.0) < 1e-6
    for p in payloads:
        m = p["metrics"]
        assert "infer_ms" in m
        assert "json_ms" in m
        assert "cpu_percent" in m
        assert "rss_bytes" in m


def test_timestamp_metrics(monkeypatch):
    class Pose(DummyPose):
        def process(self, image: Any) -> list[Any]:
            return [{"x": 0.0, "y": 0.0}] * 17

    times = [
        0.0,  # initial last_time
        1.0,  # ts_recv
        1.05,  # start_infer
        1.10,  # end_infer
        1.20,  # now
        1.25,  # start_json
        1.26,  # end_json
        1.27,  # ts_out
    ]

    def fake_perf_counter() -> float:
        return times.pop(0)

    monkeypatch.setattr(server.time, "perf_counter", fake_perf_counter)
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: Pose())
    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    _, buf = server.cv2.imencode(".jpg", frame)
    ts_send = 100.0
    data = struct.pack("<d", ts_send) + buf.tobytes()
    ws = DummyWS([data])

    asyncio.run(server.pose_endpoint(ws))

    payload = json.loads(ws.sent[0])
    m = payload["metrics"]
    assert abs(m["uplink_ms"] - (1000.0 - ts_send)) < 1e-6
    assert abs(m["wait_ms"] - 50.0) < 1e-6
    assert abs(m["ts_out"] - 1.27) < 1e-6
    assert "cpu_percent" in m
    assert "rss_bytes" in m
