$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir '..')

npx --yes markdownlint-cli '**/*.md' --ignore node_modules --ignore .pre-commit-cache --ignore frontend/dist --ignore docs/_build
black --check backend scripts tests docs
ruff check backend scripts tests
python scripts/repo_checks.py
