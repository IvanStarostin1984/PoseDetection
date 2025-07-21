from __future__ import annotations

from typing import Dict, List


def filter_visible(
    keypoints: List[Dict[str, float]], threshold: float
) -> List[Dict[str, float]]:
    """Return points with visibility >= threshold."""
    return [pt for pt in keypoints if pt.get("visibility", 0.0) >= threshold]
