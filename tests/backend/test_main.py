import numpy as np
from fastapi.testclient import TestClient
import backend.main as main


class FakeCapture:
    def __init__(self, ret=True):
        self._ret = ret
        self.frame = np.zeros((1, 1, 3), dtype=np.uint8)

    def read(self):
        return self._ret, self.frame


class FakeDetector:
    def process(self, frame):
        return [{"x": 0.0, "y": 0.0, "visibility": 1.0}]


def test_pose_stream_success(monkeypatch):
    monkeypatch.setattr(main, "_capture", FakeCapture())
    monkeypatch.setattr(main, "_detector", FakeDetector())
    client = TestClient(main.app)
    with client.websocket_connect("/pose") as ws:
        data = ws.receive_json()
        assert "keypoints" in data
        assert data["keypoints"][0]["visibility"] == 1.0


def test_pose_stream_capture_fail(monkeypatch):
    monkeypatch.setattr(main, "_capture", FakeCapture(ret=False))
    monkeypatch.setattr(main, "_detector", FakeDetector())
    client = TestClient(main.app)
    with client.websocket_connect("/pose") as ws:
        data = ws.receive_json()
        assert data == {"error": "capture failed"}
