$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir '..')

mypy backend
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
