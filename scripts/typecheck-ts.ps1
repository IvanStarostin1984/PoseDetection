$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir '..')

npx --yes tsc --noEmit -p frontend/tsconfig.json
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
