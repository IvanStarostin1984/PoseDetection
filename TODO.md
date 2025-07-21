# TODO – Road‑map (last updated: 2025-07-21)

> *Record only high‑level milestones here; break micro‑tasks out into Issues.*
> **When you finish a task, tick it and append a short NOTE entry
> (see NOTES.md).**
> Keep this list ordered by topic and **never reorder past items**.

## 0 · Project bootstrap

- [x] Commit starter governance files (`AGENTS.md`, `TODO.md`, `NOTES.md`,
        minimal CI)
- [x] Audit repository & docs; identify the single source of truth
(spec, assignment …) and reference it in README
- [x] Configure `make lint` and `make test` (cover every language tool‑chain)
- [x] Add `.codex/setup.sh`; ensure it is idempotent and exits 0
- [x] Generate initial dependency manifests (`requirements.txt`,
        `package.json`, `pubspec.yaml`, …) with pinned versions
- [x] Define ownership of all generated code in `/generated/**` and record the
      regeneration command in `AGENTS.md`
- [x] Push the first green CI run (docs‑only + full‑tests job)

## 1 · Core functionality

*Repeat the five-bullet block below for every MVP feature A, B, C, ...*

- [x] Analyse source-of-truth docs; define acceptance criteria for feature A
- [x] Document assumptions / edge‑cases for feature A in `/docs` or README
- [ ] Implement feature A
- [ ] Add unit / integration tests for feature A
- [ ] Wire CI quality gate (coverage ≥ 80 %, metric thresholds, etc.) that
      exits 1 on regression

## 2 · Documentation & CI

- [x] Write README quick‑start (clone → setup → test)
- [x] Add full doc build (Sphinx / JSDoc / dart‑doc as applicable)
- [x] Integrate secret‑detection helper step in CI (`has_token` pattern)
- [x] Extend CI matrix for all runtimes (Python, Node, Dart, Rust, …)
- [x] Add Actionlint + markdown‑link‑check jobs and pin their versions
- [x] Publish docs to GitHub Pages when `GH_PAGES_TOKEN` is present

## 3 · Quality & automation

- [x] Add pre-commit hooks (formatters, linters, markdownlint, actionlint)
- [x] Add actionlint to the pre-commit configuration
- [x] Enforce coverage threshold (≥ 80 % branch, exclude `/generated/**`)
- [x] Add linters for conflict markers, trailing spaces and NOTES ordering
- [x] Introduce dependabot / Renovate with the version‑pin policy from
      `AGENTS.md`
- [x] Prefetch pre-commit hooks during setup so offline runs work.

## 4 · Stretch goals

- [x] Containerise dev environment (Dockerfile or dev‑container.json)
- [ ] Auto‑deploy docs & storybooks on each tag
- [ ] Publish packages (PyPI, npm, pub.dev) via release workflow
- [ ] Add optional load‑testing / performance CI stage

---

### Add new items below this line

 (append only; keep earlier history intact)

- [x] Remove duplicate tagline from README
- [x] Automate updating the TODO header date whenever tasks change.
- [x] Document local docs-only linting in AGENTS guide.
- [x] Fix markdown formatting in NOTES template.
- [x] Note that conflict-marker quoting is documented in AGENTS guide.
- [x] Implement generation script to support `make generate`.
- [x] Add .gitignore to exclude build artefacts.
- [x] Extend setup script to install dependencies automatically.
- [x] Remind to run `make lint-docs` after editing NOTES or TODO.
- [x] Emphasise linting all Markdown files in AGENTS guide.
- [x] Mention CODING_RULES doc link in AGENTS guide.
- [x] Regularly verify dependency versions for compatibility issues.
- [x] Provide script to check pinned package versions exist.
- [x] Update TypeScript to 5.5.4 in package.json.
- [x] Clarify nested bullet indentation rule in AGENTS guide.
- [x] Add Python linter (`ruff`) and update docs to mention new lint step.
- [x] Add MIT license file and reference it in README.
- [x] Document public functions in scripts for clarity.
- [x] Pin `websockets` dependency and update README accordingly.
- [x] Document how to run the backend and frontend locally.
- [x] Add server entrypoint and startup test for backend.
- [x] Basic React frontend with PoseViewer and WebSocket hook.
- [x] Add backend analytics module with WebSocket integration.
- [x] Add MediaPipe pose detector and FastAPI server with `/pose` WebSocket.
- [x] Support side-specific landmarks in `extract_pose_metrics`.
- [x] Add pose classification metric and expose it in server and UI.
- [x] Quote `$GITHUB_OUTPUT` in secret-check step of CI workflow.
- [x] Setup script installs `pre-commit` automatically.
- [x] Setup script installs pre-commit hooks and runs them once.
- [x] Allow customizing WebSocket host and port; default 8000 in `resolveUrl`.
- [x] Add SKIP_PRECOMMIT option in setup script to skip hook installation when offline.
- [x] Store pre-commit hooks in `.pre-commit-cache` for offline reuse.
- [x] Add index.tsx entrypoint and bundler script for frontend.
- [x] Configure CI to pass `SKIP_PRECOMMIT=1` when running setup.
- [x] Remove deprecated backend main entrypoint and tests.
- [x] Integrate mypy type checking with Makefile target and CI.
- [x] Run black formatting via Makefile lint
- [x] Ignore mypy, pytest and ruff caches in .gitignore.
- [x] Close MediaPipe pose detector after releasing camera in server.
- [x] Setup script respects existing PRE_COMMIT_HOME variable.
- [x] Mention SKIP_PRECOMMIT usage in README quick-start instructions.
- [x] Lint backend with ruff in Makefile.
- [x] Add robustness tests for repeated WebSocket connections to /pose.
- [x] Emphasise running `./.codex/setup.sh` before tests in README.
- [x] Draw skeleton edges in the PoseViewer canvas overlay.
- [x] Stream 17 keypoints via PoseDetector and close resources.
- [x] Display knee angle in MetricsPanel with tests.
- [x] Show WebSocket connection status in the UI.
- [x] Use PoseLandmark names for 17 keypoints across backend and frontend.
- [x] Setup script calls `python3 -m pre_commit` to install hooks.
- [x] Document optional host and port arguments for `useWebSocket` in README.
- [x] Simplify `lint-docs` to run markdownlint and conflict marker check only.
- [x] Add test for resolveUrl custom host and port.
- [x] Format `docs/source/conf.py` with Black and extend `make lint` to check `docs/`.
- [x] Add test covering PoseDetector without landmarks to hit 100% coverage.
- [x] Remove httpx pin from requirements.
- [x] Add .markdownlintignore and update AGENTS accordingly.
- [x] Document Node 20 requirement in README and package.json.
- [x] Clarify `npm run build` output in README; index.html already provided.
- [x] Add TypeScript type checking via `make typecheck-ts` and run it in CI.
- [x] Restored black formatting for docs in Makefile.
- [x] Exclude build directories from conflict marker check in `lint-docs`.
- [x] Add test for zero-length vector in `calculate_angle`.
- [x] Handle concurrent `/pose` WebSocket clients without blocking.
- [x] Match CI lint-docs grep excludes with AGENTS guidance.
- [x] Add performance test with sample frames and accuracy threshold.
- [x] Add integration test for webcam device reading at least one frame.
- [x] Add tests for pose_endpoint error cases (no frame, process fail, no landmarks).
- [x] Add performance test for pose_endpoint measuring frame loop time and round-trip.
- [x] Pin black version in requirements to allow linting without hooks.
- [x] Call `pyenv rehash` after installing packages in setup script.
- [x] Skip pose accuracy test when placeholder dataset lacks landmarks.
- [x] Clarify placeholder images in tests/data and update docs accordingly.
- [x] Pin mypy version in requirements so `make typecheck` works offline.
- [x] Serve built frontend through backend using `StaticFiles`.
- [x] Ignore WebSocket messages with `error` key and show the message in PoseViewer.
- [ ] Publish Docker image to a registry
- [x] Upgrade pages workflow to `actions/upload-pages-artifact@v3`.
- [x] Remove obsolete Jekyll Pages workflow.
- [x] Configure Pages before uploading docs
- [x] Document streaming toggle logic in README.
- [ ] Enable GitHub Pages with **GitHub Actions** as the source before
      expecting deployments.
- [x] Add posture angle metric in backend and frontend.
- [x] Set `static_image_mode=False` in PoseDetector for better streaming performance.
- [x] Add PowerShell setup script for Windows and document manual setup
      alternatives.
- [x] Document alternative wrappers and mention WSL/Docker for Windows users.
- [x] Fix PowerShell setup script for compatibility with PowerShell 5.1.
- [x] Add PowerShell wrappers and npm `win:*` scripts for lint/test/docs.
- [x] Provide cross-platform `pymake.py` wrapper for Make targets.
- [x] Provide PowerShell wrappers for Makefile commands.
- [x] Close WebSocket when stopping the webcam and reopen when restarted.
- [x] Dynamically size canvas to video dimensions in PoseViewer.
- [x] Add Windows CI job running PowerShell wrappers.
- [x] Style pose container overlay to align video and canvas.
- [x] Move PowerShell wrappers into `scripts/` and remove the
      `scripts/windows/` folder.
- [x] Add tests for `pymake` and PowerShell wrappers.
- [x] Ensure PowerShell wrapper scripts exit when commands fail.
- [x] Add npm script `win:setup` and document running `npm run win:setup`.
- [x] Wrap metrics in `MetricsPanel` in separate elements and update tests.
- [x] Include `backend/server.py` in coverage checks by removing it from
      `.coveragerc` omit list.
- [x] Handle camera open failure in pose_endpoint.
- [x] Clarify that `useWebSocket` host parameter should omit protocol prefix in README.
- [x] Lint and typecheck cover `pymake.py` and scripts.
- [x] Explain that `scripts/setup.ps1` installs packages for the active Python
  interpreter and rerun it when an IDE creates a new `.venv`.
- [x] Serve static files after defining routes so WebSocket connections work.
- [x] Receive JPEG frames from clients over `/pose` WebSocket and decode them server-side.
- [x] Send webcam frames as JPEG blobs over WebSocket.
- [x] Remove fixed height from .pose-container so metrics show below the video.
- [x] Handle device pixel ratio and mirroring in PoseViewer overlay using a
      ResizeObserver.
- [x] Scale pose drawing context during render instead of via
      `alignCanvasToVideo`.
- [x] Refactor overlay scaling logic and update tests accordingly.
- [x] Convert normalized landmarks to pixels in `drawSkeleton` for accurate
      overlay scaling.
- [x] Set `ctx.lineWidth` only in `drawSkeleton` and remove duplicate call from
      `PoseViewer`. Add test for scale handling.
- [x] Use absolute scale from `getTransform` in `drawSkeleton` and ensure
      positive line width.
- [x] Add FPS metric to backend payload and display it.
