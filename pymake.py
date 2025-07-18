#!/usr/bin/env python3
"""Cross-platform dispatcher for Make targets.

Run ``make`` on Unix systems or a PowerShell script on Windows. The script
expects one command argument such as ``lint`` or ``typecheck``. It prints a
list of available commands when called without arguments or with an
unknown command.
"""
from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path

COMMANDS = {
    "lint",
    "lint-docs",
    "test",
    "generate",
    "docs",
    "typecheck",
    "typecheck-ts",
    "update-todo-date",
    "check-versions",
}


def _print_usage() -> None:
    cmds = ", ".join(sorted(COMMANDS))
    print(f"Usage: {Path(__file__).name} <command>")
    print(f"Available commands: {cmds}")


def main(argv: list[str] | None = None) -> int:
    args = argv if argv is not None else sys.argv[1:]
    if len(args) != 1 or args[0] not in COMMANDS:
        _print_usage()
        return 1
    command = args[0]

    if os.name == "nt":
        script_dir = Path(__file__).resolve().parent / "scripts"
        script = script_dir / f"{command}.ps1"
        if not script.is_file():
            print(f"error: missing script {script}", file=sys.stderr)
            return 1
        exe = shutil.which("pwsh") or "powershell"
        cmd = [
            exe,
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            str(script),
        ]
    else:
        cmd = ["make", command]

    return subprocess.call(cmd)


if __name__ == "__main__":
    raise SystemExit(main())
