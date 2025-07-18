import subprocess
import types
from pathlib import Path

import pymake


def test_pymake_builds_make_command(monkeypatch):
    calls = []

    def fake_call(cmd):
        calls.append(cmd)
        return 0

    monkeypatch.setattr(pymake, "os", types.SimpleNamespace(name="posix"))
    monkeypatch.setattr(subprocess, "call", fake_call)
    ret = pymake.main(["lint"])
    assert ret == 0
    assert calls == [["make", "lint"]]


def _setup_script(tmp_path):
    script_dir = tmp_path / "scripts"
    script_dir.mkdir()
    script = script_dir / "lint.ps1"
    script.write_text("")
    return script


def test_pymake_prefers_pwsh(tmp_path, monkeypatch):
    _setup_script(tmp_path)
    monkeypatch.chdir(tmp_path)

    calls = []

    def fake_call(cmd):
        calls.append(cmd)
        return 0

    monkeypatch.setattr(pymake, "os", types.SimpleNamespace(name="nt"))
    monkeypatch.setattr(
        pymake.shutil, "which", lambda exe: "pwsh" if exe == "pwsh" else None
    )
    monkeypatch.setattr(subprocess, "call", fake_call)
    ret = pymake.main(["lint"])
    expected = [
        "pwsh",
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        str(Path("scripts") / "lint.ps1"),
    ]
    assert ret == 0
    assert calls == [expected]


def test_pymake_falls_back_to_powershell(tmp_path, monkeypatch):
    _setup_script(tmp_path)
    monkeypatch.chdir(tmp_path)

    calls = []

    def fake_call(cmd):
        calls.append(cmd)
        return 0

    monkeypatch.setattr(pymake, "os", types.SimpleNamespace(name="nt"))
    monkeypatch.setattr(pymake.shutil, "which", lambda exe: None)
    monkeypatch.setattr(subprocess, "call", fake_call)
    ret = pymake.main(["lint"])
    expected = [
        "powershell",
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        str(Path("scripts") / "lint.ps1"),
    ]
    assert ret == 0
    assert calls == [expected]
