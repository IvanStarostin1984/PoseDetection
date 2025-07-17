# PowerShell wrapper for `make typecheck-ts` running the TypeScript compiler.
# Requires Node packages installed via scripts/setup.ps1.

$ErrorActionPreference = 'Stop'

npx --yes tsc --noEmit -p frontend/tsconfig.json
exit $LASTEXITCODE
