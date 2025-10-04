from __future__ import annotations

import subprocess
import sys
from datetime import date
from pathlib import Path


def test_show_date():
    """Test that show_date script prints today's date."""
    repo_root = Path(__file__).resolve().parents[1]
    script = repo_root / "scripts" / "show_date.py"
    result = subprocess.run(
        [sys.executable, str(script)], capture_output=True, text=True
    )
    assert result.returncode == 0

    today = date.today().isoformat()
    assert today in result.stdout
    assert "Today's date is:" in result.stdout


def test_show_date_output_format():
    """Test that show_date output matches expected format."""
    repo_root = Path(__file__).resolve().parents[1]
    script = repo_root / "scripts" / "show_date.py"
    result = subprocess.run(
        [sys.executable, str(script)], capture_output=True, text=True
    )
    assert result.returncode == 0

    today = date.today().isoformat()
    expected = f"Today's date is: {today}\n"
    assert result.stdout == expected
