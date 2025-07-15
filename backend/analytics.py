from __future__ import annotations

from math import atan2, degrees, sqrt
from typing import Dict, Mapping


Point = Mapping[str, float]


def _validate_point(pt: Point) -> None:
    if pt is None or "x" not in pt or "y" not in pt:
        raise ValueError("invalid point")


def calculate_angle(a: Point, b: Point, c: Point) -> float:
    """Return the angle ABC in degrees.

    Parameters
    ----------
    a, b, c : Mapping[str, float]
        Points with ``x`` and ``y`` coordinates.

    Returns
    -------
    float
        Angle at point ``b`` in degrees.

    Raises
    ------
    ValueError
        If any point is missing coordinates.
    """
    _validate_point(a)
    _validate_point(b)
    _validate_point(c)
    abx = a["x"] - b["x"]
    aby = a["y"] - b["y"]
    cbx = c["x"] - b["x"]
    cby = c["y"] - b["y"]
    dot = abx * cbx + aby * cby
    mag_ab = sqrt(abx**2 + aby**2)
    mag_cb = sqrt(cbx**2 + cby**2)
    if mag_ab == 0 or mag_cb == 0:
        raise ValueError("zero-length vector")
    cos_angle = max(min(dot / (mag_ab * mag_cb), 1.0), -1.0)
    return degrees(atan2(sqrt(1 - cos_angle**2), cos_angle))


def balance_score(landmarks: Mapping[str, Point]) -> float:
    """Return a simple left/right balance score.

    Parameters
    ----------
    landmarks : Mapping[str, Point]
        Pose landmarks keyed by name. Requires ``left_hip`` and ``right_hip``.

    Returns
    -------
    float
        Absolute x-axis difference between hips (0..1 range).

    Raises
    ------
    ValueError
        If required landmarks are missing.
    """
    left = landmarks.get("left_hip")
    right = landmarks.get("right_hip")
    _validate_point(left)
    _validate_point(right)
    return abs(left["x"] - right["x"])


def pose_classification(landmarks: Mapping[str, Point]) -> str:
    """Return 'standing', 'sitting' or 'unknown'."""
    hip_angle = float("nan")
    knee_angle = float("nan")
    for side in ("left", "right"):
        try:
            hip_angle = calculate_angle(
                landmarks[f"{side}_shoulder"],
                landmarks[f"{side}_hip"],
                landmarks[f"{side}_knee"],
            )
            knee_angle = calculate_angle(
                landmarks[f"{side}_hip"],
                landmarks[f"{side}_knee"],
                landmarks[f"{side}_ankle"],
            )
            break
        except KeyError:
            continue
        except ValueError:
            hip_angle = float("nan")
            knee_angle = float("nan")
            break
    if hip_angle != hip_angle or knee_angle != knee_angle:
        return "unknown"
    if hip_angle > 150 and knee_angle > 150:
        return "standing"
    return "sitting"


def extract_pose_metrics(landmarks: Mapping[str, Point]) -> Dict[str, float]:
    """Return analytics dictionary from pose landmarks."""
    knee_angle = float("nan")
    for side in ("left", "right"):
        try:
            knee_angle = calculate_angle(
                landmarks[f"{side}_hip"],
                landmarks[f"{side}_knee"],
                landmarks[f"{side}_ankle"],
            )
            break
        except KeyError:
            continue
        except ValueError:
            knee_angle = float("nan")
            break
    try:
        balance = balance_score(landmarks)
    except ValueError:
        balance = float("nan")
    pose = pose_classification(landmarks)
    return {"knee_angle": knee_angle, "balance": balance, "pose_class": pose}
