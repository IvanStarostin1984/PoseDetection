# Windows setup script mirroring .codex/setup.sh
Param(
    [string]$PYTHON_VERSION,
    [string]$NODE_VERSION
)

if ($env:PYTHON_VERSION) {
    $PYTHON_VERSION = $env:PYTHON_VERSION
} elseif (-not $PYTHON_VERSION) {
    $PYTHON_VERSION = '3.11'
}

if ($env:NODE_VERSION) {
    $NODE_VERSION = $env:NODE_VERSION
} elseif (-not $NODE_VERSION) {
    $NODE_VERSION = '20'
}

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$PreCommitHome = $env:PRE_COMMIT_HOME
if (-not $PreCommitHome) { $PreCommitHome = Join-Path $ProjectRoot '..' | Join-Path -ChildPath '.pre-commit-cache' }
$env:PRE_COMMIT_HOME = $PreCommitHome
New-Item -ItemType Directory -Force $PreCommitHome | Out-Null
Set-Location (Join-Path $ProjectRoot '..')

function Have-Python {
    try { python --version | Select-String -Quiet $PYTHON_VERSION } catch { $false }
}
function Have-Node {
    try { node --version | Select-String -Quiet "v$NODE_VERSION" } catch { $false }
}

if (-not (Have-Python)) {
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        winget install --id "Python.Python.$PYTHON_VERSION" -e -h
    } elseif (Get-Command choco -ErrorAction SilentlyContinue) {
        choco install python --version $PYTHON_VERSION -y
    } else {
        Write-Host "Install Python $PYTHON_VERSION manually."
    }
}

if (-not (Have-Node)) {
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        winget install --id "OpenJS.NodeJS.$NODE_VERSION" -e -h
    } elseif (Get-Command choco -ErrorAction SilentlyContinue) {
        choco install nodejs --version $NODE_VERSION -y
    } else {
        Write-Host "Install Node.js $NODE_VERSION manually."
    }
}

python -m pip install -r requirements.txt
python -m pip install pre-commit
if (Get-Command pyenv -ErrorAction SilentlyContinue) { pyenv rehash }

if ((Test-Path .pre-commit-config.yaml) -and $env:SKIP_PRECOMMIT -ne '1') {
    python -m pre_commit install --install-hooks --overwrite --config .pre-commit-config.yaml
    python -m pre_commit install --install-hooks --overwrite
    try { python -m pre_commit run --all-files } catch { Write-Host $_ }
}

npm install
Write-Host "Setup complete"
