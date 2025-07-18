import os
import shutil
import subprocess
from pathlib import Path

import pytest

WRAPPERS = [
    ("check_versions.ps1", "python"),
    ("docs.ps1", "sphinx-build"),
    ("generate.ps1", "python"),
    ("lint-docs.ps1", "npx"),
    ("lint.ps1", "npx"),
    ("test.ps1", "python"),
    ("typecheck-ts.ps1", "npx"),
    ("typecheck.ps1", "mypy"),
    ("update_todo_date.ps1", "python"),
]


def _powershell_exe() -> str | None:
    return shutil.which("pwsh") or shutil.which("powershell")


@pytest.mark.skipif(_powershell_exe() is None, reason="PowerShell not installed")
@pytest.mark.parametrize("script,cmd", WRAPPERS)
def test_wrapper_exits_nonzero_on_failure(tmp_path, script: str, cmd: str) -> None:
    exe = _powershell_exe()
    stub_dir = tmp_path / "bin"
    stub_dir.mkdir()
    # Create a cross-platform stub so wrappers fail regardless of PATHEXT
    stub = stub_dir / cmd
    stub.write_text("#!/bin/sh\nexit 1\n")
    stub.chmod(0o755)

    win_stub = stub_dir / f"{cmd}.cmd"
    win_stub.write_text("@echo off\r\nexit /b 1\r\n")
    win_stub.chmod(0o755)

    env = os.environ.copy()
    env["PATH"] = f"{stub_dir}{os.pathsep}{env['PATH']}"
    env["PATHEXT"] = f".CMD{os.pathsep}{env.get('PATHEXT', '')}"

    repo_root = Path(__file__).resolve().parents[1]
    script_path = repo_root / "scripts" / script
    result = subprocess.run(
        [
            exe,
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            str(script_path),
        ],
        env=env,
    )
    assert result.returncode != 0
