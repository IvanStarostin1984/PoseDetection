import json
from pathlib import Path

import scripts.check_versions as cv


def fake_urlopen_success(url):
    class Resp:
        status = 200
        def __enter__(self):
            return self
        def __exit__(self, exc_type, exc, tb):
            pass
    return Resp()


def fake_urlopen_fail(url):
    raise cv.error.HTTPError(url, 404, "not found", hdrs=None, fp=None)


def test_check_versions_cli_success(tmp_path, monkeypatch):
    (tmp_path / "requirements.txt").write_text("pkg==1.0.0\n")
    (tmp_path / "package.json").write_text(json.dumps({"dependencies": {"a": "1.0.0"}}))
    monkeypatch.setattr(cv.request, "urlopen", fake_urlopen_success)
    assert cv.check_versions(tmp_path) == 0


def test_check_versions_cli_fail(tmp_path, monkeypatch):
    (tmp_path / "requirements.txt").write_text("pkg==1.0.0\n")
    (tmp_path / "package.json").write_text(json.dumps({"dependencies": {"a": "1.0.0"}}))
    monkeypatch.setattr(cv.request, "urlopen", fake_urlopen_fail)
    assert cv.check_versions(tmp_path) == 1
