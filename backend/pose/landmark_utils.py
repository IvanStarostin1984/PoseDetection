from __future__ import annotations

from typing import Iterable, Mapping

Landmark = Mapping[str, float]


def filter_visible(
    landmarks: Iterable[Landmark], threshold: float
) -> list[dict[str, float]]:
    """Return landmarks whose ``visibility`` meets or exceeds ``threshold``."""
    if not 0.0 <= threshold <= 1.0:
        raise ValueError("threshold must be between 0 and 1")
    visible = []
    for lm in landmarks:
        if lm.get("visibility", 0.0) >= threshold:
            visible.append(
                {
                    "x": float(lm.get("x", 0.0)),
                    "y": float(lm.get("y", 0.0)),
                    "visibility": float(lm.get("visibility", 0.0)),
                }
            )
    return visible
