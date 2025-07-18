$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir '..')

npx --yes markdownlint-cli '**/*.md'
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

grep -R --line-number -E '<{7}|={7}|>{7}' `
  --exclude=ci.yml `
  --exclude-dir=node_modules `
  --exclude-dir=.pre-commit-cache `
  --exclude-dir=frontend/dist `
  --exclude-dir=docs/_build `
  . `
  && exit 1 `
  || Write-Host 'No conflict markers'
exit $LASTEXITCODE
