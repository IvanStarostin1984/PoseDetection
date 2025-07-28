from __future__ import annotations

import time
import numpy as np
from backend.pose_detector import PoseDetector


def test_inference_speed_under_40ms() -> None:
    detector = PoseDetector()
    frame = np.zeros((256, 256, 3), dtype=np.uint8)
    durations = []
    try:
        detector.process(frame)  # warm-up
        for _ in range(5):
            start = time.perf_counter()
            detector.process(frame)
            durations.append((time.perf_counter() - start) * 1000.0)
    finally:
        detector.close()
    avg = sum(durations) / len(durations)
    assert avg < 40.0, f"average inference {avg:.2f} ms >= 40 ms"
