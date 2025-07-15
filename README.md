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

Clone the repository, run `.codex/setup.sh` to install tooling and
dependencies, then check the code:

```bash
git clone <repo-url>
cd PoseDetection
.codex/setup.sh
make lint
make test
```

The Python dependencies install `mediapipe==0.10.13` and
`websockets==15.0.1`. Mediapipe 0.10.13 supports `numpy>=2`.

### Backend server

Run `python -m backend.server` to launch the FastAPI server. The `/pose`
WebSocket streams pose keypoints extracted from each video frame. The
payload includes simple analytics like knee angle, balance and a
``pose_class`` field indicating ``standing`` or ``sitting``.

## Development

Run `make lint` to check Markdown and Python code style (ruff).
Run `make test` to execute the test-suite.
CI runs `make check-versions` whenever dependency files change to
ensure pinned versions are valid.
Pre-commit hooks are installed automatically by `.codex/setup.sh`,
so ruff, black and markdownlint run before each commit.
Dependabot reviews `requirements.txt`, `package.json` and
`package-lock.json` once a week and suggests version bumps.

## Setup

Run `.codex/setup.sh` after cloning to install Python 3.11, Node 20 and the
project dependencies. The script is idempotent and exits 0 when finished.

## Frontend

The `frontend` folder contains a small React app. Build it and run its tests:

```bash
npm run build
npm test
```

The PoseViewer component shows the live webcam feed. Use the **Start Webcam**
button to toggle the stream.

## Running locally

Start the backend with:

```bash
python -m backend.server
```

Build and serve the frontend in another terminal:

```bash
npm run build
python -m http.server --directory frontend/dist 8080
```

Then open [http://localhost:8080/](http://localhost:8080/) <!-- lychee skip -->
in your browser.

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
