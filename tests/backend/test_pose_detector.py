from __future__ import annotations

import types
import numpy as np
import backend.pose_detector as pd
from backend.config import VISIBILITY_MIN
import mediapipe as mp


class FakePose:
    def __init__(self, *args, **kwargs):
        self.closed = False

    def process(self, frame):
        lm = types.SimpleNamespace(x=1.0, y=2.0, visibility=0.5)
        return types.SimpleNamespace(
            pose_landmarks=types.SimpleNamespace(landmark=[lm] * 33)
        )

    def close(self):
        self.closed = True


class FakePoseNoLandmarks:
    def __init__(self, *args, **kwargs):
        pass

    def process(self, frame):
        return types.SimpleNamespace(pose_landmarks=None)

    def close(self):
        pass


def test_process_success(monkeypatch):
    monkeypatch.setattr(mp.solutions.pose, "Pose", FakePose)
    det = pd.PoseDetector()
    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    result = det.process(frame)
    assert len(result) == 17
    assert result[0]["x"] == 1.0


def test_process_no_landmarks(monkeypatch):
    monkeypatch.setattr(mp.solutions.pose, "Pose", FakePoseNoLandmarks)
    det = pd.PoseDetector()
    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    result = det.process(frame)
    assert result == []


def test_landmarks_constant():
    expected = [
        mp.solutions.pose.PoseLandmark.NOSE,
        mp.solutions.pose.PoseLandmark.LEFT_EYE,
        mp.solutions.pose.PoseLandmark.RIGHT_EYE,
        mp.solutions.pose.PoseLandmark.LEFT_EAR,
        mp.solutions.pose.PoseLandmark.RIGHT_EAR,
        mp.solutions.pose.PoseLandmark.LEFT_SHOULDER,
        mp.solutions.pose.PoseLandmark.RIGHT_SHOULDER,
        mp.solutions.pose.PoseLandmark.LEFT_ELBOW,
        mp.solutions.pose.PoseLandmark.RIGHT_ELBOW,
        mp.solutions.pose.PoseLandmark.LEFT_WRIST,
        mp.solutions.pose.PoseLandmark.RIGHT_WRIST,
        mp.solutions.pose.PoseLandmark.LEFT_HIP,
        mp.solutions.pose.PoseLandmark.RIGHT_HIP,
        mp.solutions.pose.PoseLandmark.LEFT_KNEE,
        mp.solutions.pose.PoseLandmark.RIGHT_KNEE,
        mp.solutions.pose.PoseLandmark.LEFT_ANKLE,
        mp.solutions.pose.PoseLandmark.RIGHT_ANKLE,
    ]
    assert pd.PoseDetector.LANDMARKS == expected


def test_process_none():
    det = pd.PoseDetector()
    try:
        det.process(None)
    except ValueError:
        pass
    else:
        assert False


def test_close(monkeypatch):
    fake = FakePose()
    monkeypatch.setattr(mp.solutions.pose, "Pose", lambda *a, **k: fake)
    det = pd.PoseDetector()
    det.close()
    assert getattr(fake, "closed", False) is True


class InspectPose:
    def __init__(self, *args, **kwargs) -> None:
        InspectPose.kwargs = kwargs

    def process(self, _frame):
        return types.SimpleNamespace(pose_landmarks=None)

    def close(self) -> None:
        pass


def test_init_sets_static_image_mode_false(monkeypatch):
    monkeypatch.setattr(mp.solutions.pose, "Pose", InspectPose)
    pd.PoseDetector()
    assert InspectPose.kwargs.get("static_image_mode") is False


def test_init_uses_model_complexity_constant(monkeypatch):
    monkeypatch.setattr(mp.solutions.pose, "Pose", InspectPose)
    pd.PoseDetector()
    assert (
        InspectPose.kwargs.get("model_complexity") == pd.PoseDetector.MODEL_COMPLEXITY
    )


def test_visibility_filter(monkeypatch):
    class LowVisPose:
        def __init__(self, *args, **kwargs):
            pass

        def process(self, _frame):
            lm = types.SimpleNamespace(x=0.0, y=0.0, visibility=VISIBILITY_MIN - 0.1)
            return types.SimpleNamespace(
                pose_landmarks=types.SimpleNamespace(landmark=[lm] * 33)
            )

        def close(self):
            pass

    monkeypatch.setattr(mp.solutions.pose, "Pose", LowVisPose)
    det = pd.PoseDetector()
    frame = np.zeros((1, 1, 3), dtype=np.uint8)
    result = det.process(frame)
    assert result == []
