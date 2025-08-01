# PoseDetection

realtime Human Pose Estimation System

## Specification

The project currently follows `docs/tech-challenge.txt`, which describes how
to build a realtime pose estimation system. The repository already includes a
FastAPI WebSocket server and a basic React frontend.

PoseDetection is a minimal showcase for human pose estimation. It detects body
keypoints from a webcam and serves them through a small web app.
Additional assumptions and edge cases for the first feature are listed in
[docs/feature_a.md](docs/feature_a.md).

## Quick start

Clone the repository and run the setup script to install Python and Node
packages.
On Linux or macOS use **`./.codex/setup.sh`**.
Windows users can run **`scripts/setup.ps1`** or
`npm run win:setup` from PowerShell.
The project requires Node 20 or newer.
Then check the code:

```bash
git clone <repo-url>
cd PoseDetection
# run once with network access to fetch pre-commit hooks
./.codex/setup.sh   # Windows: scripts/setup.ps1 or npm run win:setup
make lint
make test
# Windows users without make can run:
#   scripts/lint.ps1
#   scripts/test.ps1
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
simple analytics like knee angle, balance, a posture angle, ``fps`` and
``fps_avg`` values, ``infer_ms`` and ``json_ms`` timings, the ``model`` string
(``lite`` or ``full``) and a ``pose_class`` field indicating ``standing`` or
``sitting``.

## Development

Run `make lint` to check Markdown and Python code style (ruff).
On Windows you can run `npm run win:lint` instead. Similar wrappers exist for
`typecheck`, `typecheck-ts`, `test`, `docs`, `generate`, `lint-docs`,
`update-todo-date` and `check-versions`.
Run `make typecheck` to check Python types with mypy.
Run `make typecheck-ts` to compile the frontend TypeScript.
Run `make test` to execute the test-suite. Performance tests live in
`tests/performance` and run automatically. Run them on their own with
`pytest tests/performance`.
Windows wrappers for these commands live in `scripts/`.

<!-- markdownlint-disable MD013 -->
The table below lists the common Make targets and their PowerShell
equivalents:

| Make command           | PowerShell script |
| ---------------------- | ----------------- |
| `make lint`            | `npm run win:lint` or `scripts/lint.ps1` |
| `make typecheck`       | `npm run win:typecheck` or `scripts/typecheck.ps1` |
| `make typecheck-ts`    | `npm run win:typecheck-ts` or `scripts/typecheck-ts.ps1` |
| `make test`            | `npm run win:test` or `scripts/test.ps1` |
| `make docs`            | `npm run win:docs` or `scripts/docs.ps1` |
| `make generate`        | `npm run win:generate` or `scripts/generate.ps1` |
| `make lint-docs`       | `npm run win:lint-docs` or `scripts/lint-docs.ps1` |
| `make update-todo-date`| `npm run win:update-todo-date` or `scripts/update_todo_date.ps1` |
| `make check-versions`  | `npm run win:check-versions` or `scripts/check_versions.ps1` |
<!-- markdownlint-enable MD013 -->

CI runs `make check-versions` whenever dependency files change to
ensure pinned versions are valid.
Pre-commit hooks are installed automatically by `.codex/setup.sh`,
so ruff, black and markdownlint run before each commit.
Dependabot reviews `requirements.txt`, `package.json` and
`package-lock.json` once a week and suggests version bumps.

## Setup

Run the provided setup script after cloning to install Python 3.11 (set
`PYTHON_VERSION` to override) and Node 20 (set `NODE_VERSION` to change).
On Windows run `scripts/setup.ps1` or `npm run win:setup`.
Other platforms use `.codex/setup.sh`.
This installs `libgl1` and `libglib2.0-0` so `cv2` imports work on headless
servers.
It also installs `black` from `requirements.txt` so
`make lint` works even when hooks are skipped. Tests rely on these packages,
so always complete this step before running `make test`. The script is
idempotent and exits 0 when
finished. Pre-commit hooks are stored in `.pre-commit-cache/` so they can be
reused offline. The script then runs `pre-commit run --all-files`, which may
reformat files, so execute it before making changes.
The script now also installs minimal OpenCV runtime libraries—`libgl1-mesa-glx`,
`libglib2.0-0`, `libsm6`, `libxext6` and `libxrender1`.
Run it again if you cloned the repo before this change.
It installs `black` from `requirements.txt` so
`make lint` works even when hooks are skipped. Tests rely on these packages, so
always complete this step before running `make test`. The script is idempotent
and exits 0 when finished. Pre-commit hooks are stored in `.pre-commit-cache/`
so they can be reused offline. The script then runs `pre-commit run --all-files`,
which may reformat files, so execute it before making changes.

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
   The optional `psutil` package enables CPU and memory metrics.
4. Right‑click `backend/server.py` and pick **Set as Startup File**.
5. Press **F5** to launch the FastAPI server.

`scripts/setup.ps1` installs packages for the interpreter currently
active. When VS creates a new `.venv`, run the script again inside that
environment or use `pip install -r requirements.txt` before launching
the backend.

Install Node separately to build the React frontend with `npm run build`.

If `make` does not work on your platform use the provided PowerShell wrappers
via `npm run win:<target>` for any Make command. Windows users may still prefer
WSL or Docker when shell commands fail.

If `make` does not work on your platform run `pymake.py <command>` instead.
It dispatches to the same targets and will use `pwsh` when available, falling
back to `powershell` otherwise. Windows users may prefer WSL or Docker when
shell commands fail.

## Frontend

The `frontend` folder contains a small React app. Build it and run its tests:

```bash
npm run build
npm test
```

The PoseViewer component shows the live webcam feed. The **Start Webcam**
button toggles streaming on and off. Streaming begins once the webcam emits
`canplay` so frames are only captured when the video can play. Closing the
socket stops the loop. It calls `setStreaming(!streaming)` in
[`PoseViewer.tsx`](frontend/src/components/PoseViewer.tsx). A canvas overlay
draws lines between keypoints to show the pose skeleton. The helper
`resizeCanvas` reads `video.getBoundingClientRect()` and
multiplies the bounds by `window.devicePixelRatio`. It sets the canvas
width and height so drawing uses video pixels and only updates these
properties when the new values differ. `PoseViewer` listens for
`loadedmetadata` on the video and the `resize` event on `window` to keep the
overlay aligned. When drawing, PoseViewer saves the context, flips horizontally
if the video is mirrored and then calls `drawSkeleton(ctx, poseData.landmarks,
threshold)`. The threshold is the median landmark visibility from the last
500&nbsp;ms so skeleton drawing adapts when points are lost. The
surrounding

Webcam capture defaults to **640×360** to keep bandwidth low. Before
running inference the backend resizes each frame so its larger side is
`256` px. This value comes from the `backend.config.CAM_TARGET_RES`
constant which can be increased for higher accuracy at the cost of
speed.

`.pose-container` is styled so the canvas and video stack on top of each other.
`MetricsPanel` is rendered as a sibling after this container so the metrics list
appears below the video overlay.
The `useWebSocket` hook returns the latest pose data and a connection state
(`connecting`, `open`, `closed` or `error`). PoseViewer displays this state so
you know if the backend is reachable. The hook accepts optional `host` and
`port` arguments when you need to connect to another server. `host` must be
a hostname or IP address without a protocol prefix. Messages may
contain an `error` field; the hook exposes this via an `error` property and
leaves the pose data unchanged so the UI can show the problem.

If webcam access is denied the viewer now reports "Webcam access denied" next
to the connection status. The metrics panel below `.pose-container` lists
balance, pose, knee angle, posture angle, FPS, infer and JSON times, encode
time, blob size, draw time, uplink and wait times, downlink delay, latency,
client FPS, dropped frames and the model name. When `psutil` is installed
CPU and memory usage also appear.
Metrics that cannot be computed (for example when landmarks are lost)
are sent as `null` so the JSON payload never contains `NaN`.

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
server pass the host and port to `useWebSocket`. The host should be just the
hostname or IP address, for example `useWebSocket('/pose', 'example.org', 9001)`.

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
