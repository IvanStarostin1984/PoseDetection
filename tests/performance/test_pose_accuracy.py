import json
from pathlib import Path
import cv2
import pytest
from backend.pose_detector import PoseDetector

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
LABELS_FILE = DATA_DIR / "labels.json"


@pytest.mark.skipif(not LABELS_FILE.exists(), reason="sample dataset not found")
def test_pose_accuracy() -> None:
    """Compare predicted landmarks with ground truth and assert high accuracy."""
    with LABELS_FILE.open() as f:
        samples = json.load(f)
    detector = PoseDetector()
    total = 0
    matched = 0
    try:
        for sample in samples:
            img_path = DATA_DIR / sample["image"]
            if not img_path.exists():
                pytest.skip(f"missing image {img_path}")
            frame = cv2.imread(str(img_path))
            result = detector.process(frame)
            expected = sample["landmarks"]
            if not result:
                continue
            for pred, exp in zip(result, expected):
                dx = pred["x"] - exp["x"]
                dy = pred["y"] - exp["y"]
                dist = (dx * dx + dy * dy) ** 0.5
                if dist < 0.05:
                    matched += 1
                total += 1
    finally:
        detector.close()
    accuracy = matched / total if total else 0
    assert accuracy >= 0.8, f"accuracy {accuracy:.2f} < 0.8"
