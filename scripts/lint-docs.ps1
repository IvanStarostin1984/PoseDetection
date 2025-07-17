npx --yes markdownlint-cli '**/*.md'
grep -R --line-number -E '<{7}|={7}|>{7}' --exclude=ci.yml --exclude-dir=node_modules --exclude-dir=.pre-commit-cache --exclude-dir=frontend/dist --exclude-dir=docs/_build . && exit 1 || Write-Host "No conflict markers"
