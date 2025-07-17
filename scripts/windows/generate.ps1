# PowerShell wrapper for `make generate`.
# Runs the code generator.
# Requires dependencies installed via scripts/setup.ps1.

$ErrorActionPreference = 'Stop'

python scripts/generate.py
exit $LASTEXITCODE
