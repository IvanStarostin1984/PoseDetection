from __future__ import annotations

from backend import config


def test_visibility_min_constant() -> None:
    assert config.VISIBILITY_MIN == 0.50


def test_cam_target_res_constant() -> None:
    assert config.CAM_TARGET_RES == 256
