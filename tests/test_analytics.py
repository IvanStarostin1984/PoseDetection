import math
import pytest

from backend.analytics import calculate_angle, balance_score, extract_pose_metrics


def test_calculate_angle_basic():
    a = {'x': 0.0, 'y': 0.0}
    b = {'x': 1.0, 'y': 0.0}
    c = {'x': 1.0, 'y': 1.0}
    angle = calculate_angle(a, b, c)
    assert math.isclose(angle, 90.0, abs_tol=1e-2)


def test_calculate_angle_invalid():
    a = {'x': 0.0}
    with pytest.raises(ValueError):
        calculate_angle(a, {'x': 0.0, 'y': 0.0}, {'x': 1.0, 'y': 0.0})


def test_balance_score_missing():
    with pytest.raises(ValueError):
        balance_score({})


def test_extract_pose_metrics_missing_landmarks():
    metrics = extract_pose_metrics({})
    assert math.isnan(metrics['knee_angle'])
    assert math.isnan(metrics['balance'])
