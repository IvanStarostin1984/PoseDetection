import sys
from pathlib import Path
import subprocess


def test_generate_script(tmp_path):
    repo_root = Path(__file__).resolve().parents[1]
    example = repo_root / "generated" / "example.txt"
    if example.exists():
        example.unlink()
    result = subprocess.run([sys.executable, "scripts/generate.py"], cwd=repo_root)
    assert result.returncode == 0
    assert example.exists()
    assert example.read_text() == "placeholder output\n"


def test_generate_script_unwritable(tmp_path, monkeypatch):
    repo_root = tmp_path
    scripts_dir = repo_root / "scripts"
    scripts_dir.mkdir()
    from scripts import generate
    monkeypatch.setattr(generate, "__file__", str(scripts_dir / "generate.py"))

    gen_dir = repo_root / "generated"
    gen_dir.mkdir()

    def fail_write(self, *args, **kwargs):
        raise PermissionError("no write")

    monkeypatch.setattr(Path, "write_text", fail_write)

    result = generate.generate()
    assert result == 1
    assert not (gen_dir / "example.txt").exists()
