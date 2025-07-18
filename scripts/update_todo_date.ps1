$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir '..')

python scripts/update_todo_date.py
exit $LASTEXITCODE
