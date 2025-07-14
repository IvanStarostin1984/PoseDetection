import types
import numpy as np
import backend.pose_detector as pd
import mediapipe as mp


class FakePose:
    def __init__(self, *args, **kwargs):
        pass

    def process(self, frame):
        lm = types.SimpleNamespace(x=1.0, y=2.0, visibility=0.5)
        return types.SimpleNamespace(pose_landmarks=types.SimpleNamespace(landmark=[lm] * 33))


def test_process_success(monkeypatch):
    monkeypatch.setattr(mp.solutions.pose, "Pose", FakePose)
    det = pd.PoseDetector()
    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    result = det.process(frame)
    assert len(result) == 17
    assert result[0]["x"] == 1.0


def test_process_none():
    det = pd.PoseDetector()
    try:
        det.process(None)
    except ValueError:
        pass
    else:
        assert False
