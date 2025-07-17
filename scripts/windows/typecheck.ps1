# PowerShell wrapper for `make typecheck` running mypy.
# Requires dependencies installed via scripts/setup.ps1.

$ErrorActionPreference = 'Stop'

mypy backend
exit $LASTEXITCODE
