$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir '..')

python scripts/generate.py
exit $LASTEXITCODE
