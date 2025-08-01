from __future__ import annotations

import pytest

from backend.pose.landmark_utils import filter_visible


def test_filter_visible_keeps_above_threshold():
    landmarks = [
        {"x": 0.1, "y": 0.2, "visibility": 0.9},
        {"x": 0.3, "y": 0.4, "visibility": 0.5},
        {"x": 0.5, "y": 0.6, "visibility": 0.4},
    ]
    result = filter_visible(landmarks, 0.5)
    assert result == [landmarks[0], landmarks[1]]


def test_filter_visible_drops_below_threshold():
    landmarks = [
        {"x": 0.1, "y": 0.2, "visibility": 0.1},
        {"x": 0.3, "y": 0.4, "visibility": 0.2},
    ]
    assert filter_visible(landmarks, 0.5) == []


def test_filter_visible_out_of_range_threshold():
    landmarks = [{"x": 0.0, "y": 0.0, "visibility": 0.5}]
    for invalid in (-0.1, 1.1):
        with pytest.raises(ValueError):
            filter_visible(landmarks, invalid)
