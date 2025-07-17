$ErrorActionPreference = 'Stop'

if (Test-Path 'tests') {
    python -m pytest --cov=backend --cov=frontend --cov-config=.coveragerc --cov-fail-under=80
} else {
    Write-Host 'No tests yet'
}

if (Test-Path 'frontend/src/__tests__') {
    npx --yes jest
}
