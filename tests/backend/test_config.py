from __future__ import annotations

from backend import config


def test_visibility_min_constant() -> None:
    assert config.VISIBILITY_MIN == 0.50
