import sys
from pathlib import Path


def generate() -> int:
    """Write placeholder output under generated/example.txt."""
    try:
        out_path = Path(__file__).resolve().parents[1] / "generated" / "example.txt"
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text("placeholder output\n")
    except Exception as exc:  # defensive coding
        print(f"error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(generate())
