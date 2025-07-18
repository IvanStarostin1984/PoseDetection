# PoseDetection

realtime Human Pose Estimation System

## Specification

The project currently follows `docs/tech-challenge.txt`, which describes how
to build a realtime pose estimation system. The repository already includes a
FastAPI WebSocket server and a basic React frontend.

PoseDetection is a minimal showcase for human pose estimation. It detects body
keypoints from a webcam and serves them through a small web app. See
[docs/tech-challenge.txt](docs/tech-challenge.txt) for the original assignment.
Additional assumptions and edge cases for the first feature are listed in
[docs/feature_a.md](docs/feature_a.md).

## Quick start

Clone the repository and run the setup script to install Python and Node
packages.
On Linux or macOS use **`./.codex/setup.sh`**. Windows users can run
**`scripts/setup.ps1`** from PowerShell.
The project requires Node 20 or newer.
Then check the code:

```bash
git clone <repo-url>
cd PoseDetection
# run once with network access to fetch pre-commit hooks
./.codex/setup.sh   # Windows: scripts/setup.ps1
make lint
make test
# Windows users without make can run:
#   scripts/windows/lint.ps1
#   scripts/windows/test.ps1
```

If the network is unavailable pass `SKIP_PRECOMMIT=1` to the setup script.
`pre-commit run` will then try to fetch hooks and may ask for GitHub
credentials.
If PowerShell is unavailable install Python 3.11 and Node 20 manually, then run
`pip install -r requirements.txt` followed by `npm install`.

The Python dependencies install `mediapipe==0.10.13`,
`websockets==15.0.1` and `numpy==1.26.4`.
Sample frames for the performance test live in `tests/data/`.
Placeholder images and a `labels.json` file are already present.
The pose accuracy test skips unless you replace them with real frames.

### Backend server

Run `python -m backend.server` to launch the FastAPI server. The `/pose`
WebSocket streams 17 keypoints extracted from each video frame. Each point is
a dictionary with ``x``, ``y`` and ``visibility``. The keypoints are ordered as
``nose``, ``left_eye``, ``right_eye``, ``left_ear``, ``right_ear``,
``left_shoulder``, ``right_shoulder``, ``left_elbow``, ``right_elbow``,
``left_wrist``, ``right_wrist``, ``left_hip``, ``right_hip``, ``left_knee``,
``right_knee``, ``left_ankle`` and ``right_ankle``. The payload also includes
simple analytics like knee angle, balance, a posture angle and a ``pose_class``
field indicating ``standing`` or ``sitting``.

## Development

Run `make lint` to check Markdown and Python code style (ruff).
On Windows you can run `npm run win:lint` instead. Similar wrappers exist for
`typecheck`, `typecheck-ts`, `test` and `docs`.
Run `make typecheck` to check Python types with mypy.
Run `make typecheck-ts` to compile the frontend TypeScript.
Run `make test` to execute the test-suite. Performance tests live in
`tests/performance` and run automatically. Run them on their own with
`pytest tests/performance`.
Windows wrappers for these commands live in `scripts/windows/`.
CI runs `make check-versions` whenever dependency files change to
ensure pinned versions are valid.
Pre-commit hooks are installed automatically by `.codex/setup.sh`,
so ruff, black and markdownlint run before each commit.
Dependabot reviews `requirements.txt`, `package.json` and
`package-lock.json` once a week and suggests version bumps.

## Setup

Run the provided setup script after cloning to install Python 3.11 (set
`PYTHON_VERSION` to override) and Node 20 (set `NODE_VERSION` to change).
On Windows use `scripts/setup.ps1`; other platforms use `.codex/setup.sh`.
This installs `black` from `requirements.txt` so
`make lint` works even when hooks are skipped. Tests rely on these packages,
so always complete this step before running `make test`. The script is
idempotent and exits 0 when
finished. Pre-commit hooks are stored in `.pre-commit-cache/` so they can be
reused offline. The script then runs `pre-commit run --all-files`, which may
reformat files, so execute it before making changes.

Alternatively build the provided Dockerfile:

```bash
docker build -t posedetect .
```

See [docs/CONTAINER.md](docs/CONTAINER.md) for details on running the image.

## Visual Studio 2022

Follow these steps to run the backend from Visual Studio:

1. Open the repository folder in VS 2022.
2. In **Python Environments** choose **Add Environment** → **Virtual
   Environment** and create a `.venv`.
3. Install the requirements with `pip install -r requirements.txt`.
4. Right‑click `backend/server.py` and pick **Set as Startup File**.
5. Press **F5** to launch the FastAPI server.

Install Node separately to build the React frontend with `npm run build`.

If `make` does not work on your platform use the provided PowerShell wrappers
with `npm run win:lint` and `npm run win:test`. Windows users may still prefer
WSL or Docker when shell commands fail.

If `make` does not work on your platform run `pymake.py <command>` instead.
It dispatches to the same targets. Windows users may prefer WSL or Docker when
shell commands fail.

## Frontend

The `frontend` folder contains a small React app. Build it and run its tests:

```bash
npm run build
npm test
```

The PoseViewer component shows the live webcam feed. The **Start Webcam**
button toggles streaming on and off. Stopping the webcam also closes the
WebSocket connection. It calls `setStreaming(!streaming)` in
[`PoseViewer.tsx`](frontend/src/components/PoseViewer.tsx). A canvas overlay
draws lines between keypoints to show the pose skeleton. The canvas size is
set from the video's `loadedmetadata` event so it matches the actual webcam
resolution.
The `useWebSocket` hook returns the latest pose data and a connection state
(`connecting`, `open`, `closed` or `error`). PoseViewer displays this state so
you know if the backend is reachable. The hook accepts optional `host` and
`port` arguments when you need to connect to another server. Messages may
contain an `error` field; the hook exposes this via an `error` property and
leaves the pose data unchanged so the UI can show the problem.

If webcam access is denied the viewer now reports "Webcam access denied" next
to the connection status. The metrics panel below the video lists each metric on
its own line for clarity.

## Running locally

Start the backend with:

```bash
python -m backend.server
```

`npm run build` bundles the app to `frontend/dist/bundle.js`. The
`index.html` file is already present in that directory. Start the backend
and open the bundled app directly:

```bash
npm run build
python -m backend.server
```

Then open [http://localhost:8000/](http://localhost:8000/) <!-- lychee skip -->
in your browser. This mount is optional; if `frontend/dist` is missing you
can still serve the files with another HTTP server.
The page connects to `ws://localhost:8000/pose` by default. To reach a remote
server pass the host and port to `useWebSocket`, for example
`useWebSocket('/pose', 'example.org', 9001)`.

## Backend

Start the API server with:

```bash
python -m backend.server
```

## Building docs

Generate the HTML documentation with:

```bash
make docs
```

The output appears in `docs/_build/html`.
Pushes to `main` run `.github/workflows/pages.yml` to build the docs.
When `GH_PAGES_TOKEN` is available the workflow deploys them to GitHub Pages.
Enable Pages in the repo settings with **GitHub Actions** as the source before
expecting deployments.

## License

PoseDetection is released under the MIT License. See [LICENSE](LICENSE).
