from __future__ import annotations

import json
from backend.server import build_payload


def test_build_payload_has_no_nan() -> None:
    lms = [{"x": 0.0, "y": 0.0, "visibility": 0.0}] * 17
    payload = build_payload(lms, 30.0, 30.0)
    text = json.dumps(payload)
    assert "NaN" not in text
    data = json.loads(text)
    assert data["metrics"]["knee_angle"] is None
