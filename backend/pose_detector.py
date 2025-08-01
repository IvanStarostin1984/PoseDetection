from __future__ import annotations

import cv2
import mediapipe as mp
import numpy as np
from backend.config import CAM_TARGET_RES


class PoseDetector:
    """Extract 17 pose keypoints from a BGR video frame."""

    # Ordered subset of MediaPipe landmarks (COCO layout)
    LANDMARKS = [
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

    # 0 selects the lightweight model, 1 the full model
    MODEL_COMPLEXITY = 1

    def __init__(self) -> None:
        # static_image_mode=False improves performance in video streams
        self._pose = mp.solutions.pose.Pose(
            model_complexity=self.MODEL_COMPLEXITY, static_image_mode=False
        )

    def process(self, frame: np.ndarray) -> list[dict[str, float]]:
        """Return 17 keypoints as dicts with x, y and visibility."""
        if frame is None:
            raise ValueError("frame is None")
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        h, w = rgb.shape[:2]
        scale = CAM_TARGET_RES / max(h, w)
        size = (int(round(w * scale)), int(round(h * scale)))
        resized = cv2.resize(rgb, size, interpolation=cv2.INTER_AREA)
        results = self._pose.process(resized)
        if not results.pose_landmarks:
            return []
        keypoints = []
        for lm_index in self.LANDMARKS:
            lm = results.pose_landmarks.landmark[lm_index.value]
            keypoints.append(
                {
                    "x": float(lm.x),
                    "y": float(lm.y),
                    "visibility": float(lm.visibility),
                }
            )
        return keypoints

    def close(self) -> None:
        """Release MediaPipe resources."""
        self._pose.close()
