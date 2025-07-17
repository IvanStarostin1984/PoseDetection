import math
import pytest

from backend.analytics import (
    calculate_angle,
    balance_score,
    extract_pose_metrics,
    pose_classification,
)


def test_calculate_angle_basic():
    a = {"x": 0.0, "y": 0.0}
    b = {"x": 1.0, "y": 0.0}
    c = {"x": 1.0, "y": 1.0}
    angle = calculate_angle(a, b, c)
    assert math.isclose(angle, 90.0, abs_tol=1e-2)


def test_calculate_angle_invalid():
    a = {"x": 0.0}
    with pytest.raises(ValueError):
        calculate_angle(a, {"x": 0.0, "y": 0.0}, {"x": 1.0, "y": 0.0})


def test_calculate_angle_zero_length():
    a = {"x": 1.0, "y": 1.0}
    b = {"x": 1.0, "y": 1.0}
    c = {"x": 2.0, "y": 2.0}
    with pytest.raises(ValueError):
        calculate_angle(a, b, c)


def test_balance_score_missing():
    with pytest.raises(ValueError):
        balance_score({})


def test_extract_pose_metrics_missing_landmarks():
    metrics = extract_pose_metrics({})
    assert math.isnan(metrics["knee_angle"])
    assert math.isnan(metrics["balance"])
    assert math.isnan(metrics["posture_angle"])
    assert metrics["pose_class"] == "unknown"


def test_extract_pose_metrics_left_side():
    lms = {
        "left_shoulder": {"x": 0.0, "y": -1.0},
        "left_hip": {"x": 0.0, "y": 0.0},
        "left_knee": {"x": 0.0, "y": 1.0},
        "left_ankle": {"x": 1.0, "y": 1.0},
        "right_hip": {"x": 1.0, "y": 0.0},
    }
    metrics = extract_pose_metrics(lms)
    assert not math.isnan(metrics["knee_angle"])
    assert not math.isnan(metrics["balance"])
    assert not math.isnan(metrics["posture_angle"])
    assert metrics["pose_class"] in {"standing", "sitting", "unknown"}


def test_extract_pose_metrics_right_side():
    lms = {
        "right_shoulder": {"x": 1.0, "y": -1.0},
        "right_hip": {"x": 1.0, "y": 0.0},
        "right_knee": {"x": 1.0, "y": 1.0},
        "right_ankle": {"x": 0.0, "y": 1.0},
        "left_hip": {"x": 0.0, "y": 0.0},
    }
    metrics = extract_pose_metrics(lms)
    assert not math.isnan(metrics["knee_angle"])
    assert not math.isnan(metrics["balance"])
    assert not math.isnan(metrics["posture_angle"])
    assert metrics["pose_class"] in {"standing", "sitting", "unknown"}


def test_pose_classification():
    lms = {
        "left_shoulder": {"x": 0.0, "y": 0.0},
        "left_hip": {"x": 0.0, "y": 1.0},
        "left_knee": {"x": 0.0, "y": 2.0},
        "left_ankle": {"x": 0.0, "y": 3.0},
    }
    assert pose_classification(lms) == "standing"
    lms["left_knee"]["x"] = 1.0
    assert pose_classification(lms) == "sitting"
