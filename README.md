# PoseDetection

PoseDetection is a minimal showcase for human pose estimation. It detects body
keypoints from a webcam and serves them through a small web app. See
[docs/tech-challenge.txt](docs/tech-challenge.txt) for the original assignment.

## Quick start

Clone the repository, run `.codex/setup.sh` to install tooling, then check the
code:

```bash
git clone <repo-url>
cd PoseDetection
.codex/setup.sh
make lint
make test
```
realtime Human Pose Estimation System

## Development
Run `make lint` to check documentation style.
Run `make test` to execute the future test-suite.

## Setup

Run `.codex/setup.sh` after cloning to install Python 3.11 and Node 20.
The script is idempotent and exits 0 when finished.
