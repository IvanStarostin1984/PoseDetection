# PowerShell wrapper for `make test`.
# Runs pytest and frontend Jest tests when present.
# Requires dependencies installed via scripts/setup.ps1.

$ErrorActionPreference = 'Stop'

if (Test-Path tests) {
    python -m pytest --cov=backend --cov=frontend --cov-config=.coveragerc --cov-fail-under=80
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} else {
    Write-Host 'No tests yet'
}

if (Test-Path 'frontend/src/__tests__') {
    npx --yes jest
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

exit 0
