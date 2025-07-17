# PowerShell wrapper for `make docs` building the Sphinx HTML docs.
# Requires dependencies installed via scripts/setup.ps1.

$ErrorActionPreference = 'Stop'

Push-Location docs
try {
    ./make.bat html
    $code = $LASTEXITCODE
} finally {
    Pop-Location
}
exit $code
