#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
PRE_COMMIT_HOME="${PRE_COMMIT_HOME:-$PROJECT_ROOT/.pre-commit-cache}"
export PRE_COMMIT_HOME
mkdir -p "$PRE_COMMIT_HOME"
cd "$PROJECT_ROOT"

# install toolchains with pinned versions; safe to run multiple times
PYTHON_VERSION=3.11
NODE_VERSION=20

have_python() {
  command -v python3 >/dev/null 2>&1 && python3 -V | grep -q "$PYTHON_VERSION"
}

have_node() {
  command -v node >/dev/null 2>&1 && node -v | grep -q "v$NODE_VERSION"
}

if ! have_python; then
  echo "Installing Python $PYTHON_VERSION" >&2
  sudo apt-get update -y
  sudo apt-get install -y software-properties-common >/dev/null
  sudo add-apt-repository -y ppa:deadsnakes/ppa
  sudo apt-get update -y
  sudo apt-get install -y python${PYTHON_VERSION} python${PYTHON_VERSION}-venv
  sudo ln -sf /usr/bin/python${PYTHON_VERSION} /usr/local/bin/python3
fi

if ! have_node; then
  echo "Installing Node.js $NODE_VERSION" >&2
  curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
python3 -m pip install -r requirements.txt
python3 -m pip install pre-commit

# install hooks into the shared cache while network is available
if [ -f .pre-commit-config.yaml ] && [ "${SKIP_PRECOMMIT:-0}" != "1" ]; then
  pre-commit install --install-hooks --overwrite --config=.pre-commit-config.yaml
  pre-commit install --install-hooks --overwrite
  pre-commit run --all-files || true
fi

npm install

echo "Setup complete"
exit 0
