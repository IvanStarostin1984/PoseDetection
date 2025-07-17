# PowerShell wrapper for `make lint`
# Run markdownlint, black, ruff and repo checks.
# Requires Node and Python packages installed via scripts/setup.ps1.
# SKIP_PRECOMMIT can be set when running setup.ps1 to skip hook installation.

$ErrorActionPreference = 'Stop'

npx --yes markdownlint-cli '**/*.md' --ignore node_modules --ignore .pre-commit-cache --ignore frontend/dist --ignore docs/_build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

black --check backend scripts tests docs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

ruff check backend scripts tests
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

python scripts/repo_checks.py
exit $LASTEXITCODE
