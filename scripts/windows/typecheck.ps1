$ErrorActionPreference = 'Stop'

mypy backend
npx --yes tsc --noEmit -p frontend/tsconfig.json
