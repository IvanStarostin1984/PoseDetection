import cv2
import mediapipe as mp
import numpy as np


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

    def __init__(self) -> None:
        self._pose = mp.solutions.pose.Pose(model_complexity=1, static_image_mode=True)

    def process(self, frame: np.ndarray) -> list[dict[str, float]]:
        """Return 17 keypoints as dicts with x, y and visibility."""
        if frame is None:
            raise ValueError("frame is None")
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self._pose.process(rgb)
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
