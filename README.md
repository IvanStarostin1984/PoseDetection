# PoseDetection

realtime Human Pose Estimation System

## Specification

The project currently follows `docs/tech-challenge.txt`, which describes how
to build a realtime pose estimation system. Future commits will add data
processing scripts, model training code and an inference server in line with
the spec.

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

## Development

Run `make lint` to check Markdown and Python code style (ruff).
Run `make test` to execute the future test-suite.

## Setup

Run `.codex/setup.sh` after cloning to install Python 3.11, Node 20 and the
project dependencies. The script is idempotent and exits 0 when finished.

## License

PoseDetection is released under the MIT License. See [LICENSE](LICENSE).
