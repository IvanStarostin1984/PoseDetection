# TODO – Road‑map (last updated: 2025-07-16)

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

- [ ] Analyse source-of-truth docs; define acceptance criteria for feature A
- [ ] Document assumptions / edge‑cases for feature A in `/docs` or README  
- [ ] Implement feature A  
- [ ] Add unit / integration tests for feature A  
- [ ] Wire CI quality gate (coverage ≥ 80 %, metric thresholds, etc.) that
      exits 1 on regression

## 2 · Documentation & CI

- [x] Write README quick‑start (clone → setup → test)
- [x] Add full doc build (Sphinx / JSDoc / dart‑doc as applicable)
- [x] Integrate secret‑detection helper step in CI (`has_token` pattern)
- [ ] Extend CI matrix for all runtimes (Python, Node, Dart, Rust, …)
- [x] Add Actionlint + markdown‑link‑check jobs and pin their versions
- [ ] Publish docs to GitHub Pages when `GH_PAGES_TOKEN` is present

## 3 · Quality & automation

- [x] Add pre-commit hooks (formatters, linters, markdownlint, actionlint)
- [x] Add actionlint to the pre-commit configuration
- [x] Enforce coverage threshold (≥ 80 % branch, exclude `/generated/**`)
- [ ] Add linters for conflict markers, trailing spaces and NOTES ordering
- [x] Introduce dependabot / Renovate with the version‑pin policy from
      `AGENTS.md`
- [x] Prefetch pre-commit hooks during setup so offline runs work.

## 4 · Stretch goals

- [ ] Containerise dev environment (Dockerfile or dev‑container.json)
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
- [x] Handle concurrent `/pose` WebSocket clients without blocking.
