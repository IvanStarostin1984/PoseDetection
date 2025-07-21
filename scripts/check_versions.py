import json
import sys
from pathlib import Path
from urllib import request, error


PYPI_URL = "https://pypi.org/pypi/{name}/{version}/json"
NPM_URL = "https://registry.npmjs.org/{name}/{version}"


def parse_requirements(req_path: Path) -> dict[str, str]:
    """Return package versions from requirements.txt."""
    packages: dict[str, str] = {}
    for line in req_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "==" not in line:
            continue
        name, version = line.split("==", 1)
        name = name.split("[", 1)[0]
        version = version.split("#", 1)[0].strip()
        packages[name] = version
    return packages


def parse_package_json(json_path: Path) -> dict[str, str]:
    """Return dependencies from package.json."""
    data = json.loads(json_path.read_text())
    packages: dict[str, str] = {}
    for section in ("dependencies", "devDependencies"):
        for name, version in data.get(section, {}).items():
            packages[name] = version
    return packages


def parse_package_lock(lock_path: Path) -> dict[str, str]:
    """Return dependencies from package-lock.json."""
    data = json.loads(lock_path.read_text())
    root = data.get("packages", {}).get("", {})
    packages: dict[str, str] = {}
    for section in ("dependencies", "devDependencies"):
        for name, version in root.get(section, {}).items():
            packages[name] = version
    return packages


def version_exists(url: str) -> bool:
    try:
        with request.urlopen(url):
            return True
    except error.HTTPError as exc:
        if exc.code == 404:
            return False
        print(f"error: {exc}", file=sys.stderr)
    except Exception as exc:  # defensive coding
        print(f"error: {exc}", file=sys.stderr)
    return False


def check_versions(repo_dir: Path) -> int:
    """Check all pinned versions in the repository."""
    failed = False
    req_file = repo_dir / "requirements.txt"
    if req_file.exists():
        for name, version in parse_requirements(req_file).items():
            url = PYPI_URL.format(name=name, version=version)
            if not version_exists(url):
                print(f"{name}=={version} not found on PyPI", file=sys.stderr)
                failed = True
    lock_file = repo_dir / "package-lock.json"
    pkg_file = repo_dir / "package.json"
    if lock_file.exists():
        deps = parse_package_lock(lock_file)
    elif pkg_file.exists():
        deps = parse_package_json(pkg_file)
    else:
        deps = {}
    for name, version in deps.items():
        if not version or version[0] in "^~":
            continue
        url = NPM_URL.format(name=name, version=version)
        if not version_exists(url):
            print(f"{name}@{version} not found on npm", file=sys.stderr)
            failed = True
    return 1 if failed else 0


if __name__ == "__main__":
    root = (
        Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
    )
    sys.exit(check_versions(root))
