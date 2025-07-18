$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir '..')

npx --yes markdownlint-cli '**/*.md' --ignore node_modules --ignore .pre-commit-cache --ignore frontend/dist --ignore docs/_build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
black --check backend scripts tests docs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
ruff check backend scripts tests
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
python scripts/repo_checks.py
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
