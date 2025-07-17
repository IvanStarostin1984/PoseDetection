# PoseDetection

realtime Human Pose Estimation System

## Specification

The project currently follows `docs/tech-challenge.txt`, which describes how
to build a realtime pose estimation system. The repository already includes a
FastAPI WebSocket server and a basic React frontend.

PoseDetection is a minimal showcase for human pose estimation. It detects body
keypoints from a webcam and serves them through a small web app. See
[docs/tech-challenge.txt](docs/tech-challenge.txt) for the original assignment.

## Quick start

Clone the repository and **run `./.codex/setup.sh` first** to install
Python and Node packages. The project requires Node 20 or newer.
Then check the code:

```bash
git clone <repo-url>
cd PoseDetection
# run once with network access to fetch pre-commit hooks
.codex/setup.sh
make lint
make test
```

If the network is unavailable pass `SKIP_PRECOMMIT=1` to the setup script.
`pre-commit run` will then try to fetch hooks and may ask for GitHub
credentials.

The Python dependencies install `mediapipe==0.10.13`,
`websockets==15.0.1` and `numpy==1.26.4`.
Sample frames for the performance test live in `tests/data/`.
Add `labels.json` and PNG images before running `pytest`.
If you want to check pose accuracy.

### Backend server

Run `python -m backend.server` to launch the FastAPI server. The `/pose`
WebSocket streams 17 keypoints extracted from each video frame. Each point is
a dictionary with ``x``, ``y`` and ``visibility``. The keypoints are ordered as
``nose``, ``left_eye``, ``right_eye``, ``left_ear``, ``right_ear``,
``left_shoulder``, ``right_shoulder``, ``left_elbow``, ``right_elbow``,
``left_wrist``, ``right_wrist``, ``left_hip``, ``right_hip``, ``left_knee``,
``right_knee``, ``left_ankle`` and ``right_ankle``. The payload also includes
simple analytics like knee angle, balance and a ``pose_class`` field
indicating ``standing`` or ``sitting``.

## Development

Run `make lint` to check Markdown and Python code style (ruff).
Run `make typecheck-ts` to compile the frontend TypeScript.
Run `make test` to execute the test-suite.
CI runs `make check-versions` whenever dependency files change to
ensure pinned versions are valid.
Pre-commit hooks are installed automatically by `.codex/setup.sh`,
so ruff, black and markdownlint run before each commit.
Dependabot reviews `requirements.txt`, `package.json` and
`package-lock.json` once a week and suggests version bumps.

## Setup

Run `.codex/setup.sh` after cloning to install Python 3.11, Node 20 and all
project dependencies. Tests rely on these packages, so always complete this
step before running `make test`. The script is idempotent and exits 0 when
finished. Pre-commit hooks are stored in `.pre-commit-cache/` so they can be
reused offline. The script then runs `pre-commit run --all-files`, which may
reformat files, so execute it before making changes.

## Frontend

The `frontend` folder contains a small React app. Build it and run its tests:

```bash
npm run build
npm test
```

The PoseViewer component shows the live webcam feed. Use the **Start Webcam**
button to toggle the stream. A canvas overlay draws lines between keypoints to
show the pose skeleton.
The `useWebSocket` hook returns the latest pose data and a connection state
(`connecting`, `open`, `closed` or `error`). PoseViewer displays this state so
you know if the backend is reachable. The hook accepts optional `host` and
`port` arguments when you need to connect to another server.

## Running locally

Start the backend with:

```bash
python -m backend.server
```

`npm run build` bundles the app to `frontend/dist/bundle.js`. The
`index.html` file is already present in that directory. Serve the frontend
in another terminal:

```bash
npm run build
python -m http.server --directory frontend/dist 8080
```

Then open [http://localhost:8080/](http://localhost:8080/) <!-- lychee skip -->
in your browser.
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

## License

PoseDetection is released under the MIT License. See [LICENSE](LICENSE).
