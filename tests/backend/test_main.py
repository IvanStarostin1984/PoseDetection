import numpy as np
from fastapi.testclient import TestClient
import backend.main as main


class FakeCapture:
    def __init__(self, ret=True):
        self._ret = ret
        self.closed = False
        self.frame = np.zeros((1, 1, 3), dtype=np.uint8)

    def read(self):
        return self._ret, self.frame

    def release(self):
        self.closed = True


class FakeDetector:
    def process(self, frame):
        return [{"x": 0.0, "y": 0.0, "visibility": 1.0}]


def test_pose_stream_success(monkeypatch):
    cap = FakeCapture()
    monkeypatch.setattr(main, "_capture", cap)
    monkeypatch.setattr(main, "_detector", FakeDetector())
    with TestClient(main.app) as client:
        with client.websocket_connect("/pose") as ws:
            data = ws.receive_json()
            assert "keypoints" in data
            assert data["keypoints"][0]["visibility"] == 1.0
    assert cap.closed


def test_pose_stream_capture_fail(monkeypatch):
    cap = FakeCapture(ret=False)
    monkeypatch.setattr(main, "_capture", cap)
    monkeypatch.setattr(main, "_detector", FakeDetector())
    with TestClient(main.app) as client:
        with client.websocket_connect("/pose") as ws:
            data = ws.receive_json()
            assert data == {"error": "capture failed"}
    assert cap.closed
