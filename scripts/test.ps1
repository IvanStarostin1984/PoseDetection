$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir '..')

if (Test-Path 'tests') {
    python -m pytest --cov=backend --cov=frontend --cov-config=.coveragerc --cov-fail-under=80
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} else {
    Write-Host 'No tests yet'
}
$hasFrontendTests = Get-ChildItem 'frontend/src','tests/frontend' -Recurse -Filter '*.test.tsx' -ErrorAction SilentlyContinue | Select-Object -First 1
if ($hasFrontendTests) {
    npx --yes jest
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
