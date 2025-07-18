import subprocess
import types

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


def test_pymake_builds_powershell_command(tmp_path, monkeypatch):
    script_dir = tmp_path / "scripts"
    script_dir.mkdir()
    script_path = script_dir / "lint.ps1"
    script_path.write_text("")
    monkeypatch.chdir(tmp_path)
    monkeypatch.setattr(pymake, "__file__", str(tmp_path / "pymake.py"))

    calls = []

    def fake_call(cmd):
        calls.append(cmd)
        return 0

    monkeypatch.setattr(pymake, "os", types.SimpleNamespace(name="nt"))
    monkeypatch.setattr(subprocess, "call", fake_call)
    ret = pymake.main(["lint"])
    expected = [
        "powershell",
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        str(script_path),
    ]
    assert ret == 0
    assert calls == [expected]


def test_pymake_works_from_subdirectory(tmp_path, monkeypatch):
    root = tmp_path / "project"
    script_dir = root / "scripts"
    script_dir.mkdir(parents=True)
    script_path = script_dir / "lint.ps1"
    script_path.write_text("")
    (root / "subdir").mkdir()

    monkeypatch.chdir(root / "subdir")
    monkeypatch.setattr(pymake, "__file__", str(root / "pymake.py"))

    calls = []

    def fake_call(cmd):
        calls.append(cmd)
        return 0

    monkeypatch.setattr(pymake, "os", types.SimpleNamespace(name="nt"))
    monkeypatch.setattr(subprocess, "call", fake_call)
    ret = pymake.main(["lint"])
    expected = [
        "powershell",
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        str(script_path),
    ]
    assert ret == 0
    assert calls == [expected]
