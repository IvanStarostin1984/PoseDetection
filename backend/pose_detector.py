import cv2
import mediapipe as mp
import numpy as np


class PoseDetector:
    """Extract 17 pose keypoints from a BGR video frame."""

    def __init__(self) -> None:
        self._pose = mp.solutions.pose.Pose(model_complexity=1)

    def process(self, frame: np.ndarray) -> list[dict[str, float]]:
        """Return 17 keypoints as dicts with x, y and visibility."""
        if frame is None:
            raise ValueError('frame is None')
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self._pose.process(rgb)
        if not results.pose_landmarks:
            return []
        keypoints = []
        for lm in results.pose_landmarks.landmark[:17]:
            keypoints.append({
                'x': float(lm.x),
                'y': float(lm.y),
                'visibility': float(lm.visibility),
            })
        return keypoints
