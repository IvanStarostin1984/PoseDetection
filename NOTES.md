# Engineering log  – append entries at **the end** (oldest → newest)

Each pull‑request **adds one new section** using the fixed template below.
*Never modify or reorder previous entries.*
Keep lines ≤ 80 chars and leave exactly **one blank line** between sections.

---

## TEMPLATE  (copy → fill → append)

### YYYY‑MM‑DD  `PR #\<number or draft\>`

- **Summary**: one‑sentence description of what changed.
- **Stage**: planning / implementation / testing / maintenance / release
- **Motivation / Decision**: why it was done, key trade‑offs.
- **Next step**: short pointer to planned follow‑up (if any).

---

## 2025‑01‑01  PR #-4

- **Summary**: Seeded repository with starter templates (`AGENTS.md`, `TODO.md`,
  `NOTES.md`) and minimal CI workflow.
- **Stage**: planning
- **Motivation / Decision**: establish collaboration conventions before code.
- **Next step**: set up lint/test commands and begin core feature A.

### 2025-06-30  PR #-3

- **Summary**: README now references docs/tech-challenge.txt as the guiding
  spec.
- **Stage**: documentation
- **Motivation / Decision**: clarify source of truth so future tasks align
  with the tech challenge.
- **Next step**: start implementing setup and lint/test commands.

## 2025-07-13  PR #-2

- **Summary**: added project overview and setup steps to README files.
- **Stage**: documentation
- **Motivation / Decision**: explain quick start and link to tech challenge.
- **Next step**: none.

- **Summary**: Metrics panel now wraps each metric in its own
  paragraph; tests updated and README clarified vertical display.
- **Stage**: implementation
- **Motivation / Decision**: improve readability by listing metrics on
  separate lines and keep docs consistent.
- **Next step**: none.

### 2025-07-18  PR #178b

- **Summary**: Metrics panel now wraps each metric in its own
  paragraph; tests updated and README clarified vertical display.
- **Stage**: implementation
- **Motivation / Decision**: improve readability by listing metrics on
  separate lines and keep docs consistent.
- **Next step**: none.

## 2025-07-13  PR #-1

- **Summary**: added Makefile with lint and test tasks;
  updated docs to pass lint.
- **Stage**: implementation
- **Motivation / Decision**: provide initial developer workflow
 as planned in TODO.
- **Next step**: create setup script and start implementing core features.

## 2025-07-13  PR #0

- **Summary**: added setup script for Python and Node and updated README.
- **Stage**: implementation
- **Motivation / Decision**: needed bootstrap
 to install toolchains idempotently.
- **Next step**: define lint and test commands.

## 2025-07-13  PR #1

- **Summary**: added fail-fast CI workflow replicating template.
- **Stage**: implementation
- **Motivation / Decision**: align repo with AGENTS.md CI;
  ensures docs-only commits run markdown lint while code triggers tests.
- **Next step**: verify workflow triggers on next push; prepare Makefile.

## 2025-07-13  PR #2

- **Summary**: ticked roadmap item for committing starter governance files.
- **Stage**: maintenance
- **Motivation / Decision**: repo already includes `AGENTS.md`, `TODO.md`,
  `NOTES.md` so the item was marked as done.
- **Next step**: add setup script and define lint/test commands.

## 2025-07-13  PR #3

- **Summary**: fixed typo in AGENTS guide.
- **Stage**: documentation
- **Motivation / Decision**: keep contributor guide accurate.

### 2025-07-13  PR #4

- **Summary**: removed duplicate tagline line in README.
- **Stage**: documentation
- **Motivation / Decision**: keep README concise.

### 2025-07-13  PR #5

- **Summary**: timestamped TODO roadmap header.
- **Stage**: documentation
- **Motivation / Decision**: keep roadmap current.

### 2025-07-13  PR #6

- **Summary**: added placeholder tests to keep CI green.
- **Stage**: implementation
- **Motivation / Decision**: needed a simple test so CI
  succeeds before features exist.
- **Next step**: prepare feature A implementation.

## 2025-07-13  PR #7

- **Summary**: added pinned dependency manifests for Python and Node.
- **Stage**: implementation
- **Motivation / Decision**: follow roadmap item for reproducible setups.
- **Next step**: none.

## 2025-07-13  PR #8

- **Summary**: bumped AGENTS.md to v1.2 and clarified docs-only lint command.
- **Stage**: documentation
- **Motivation / Decision**: keep guide current so contributors
   know to run local lint.
- **Next step**: none.
- **Docs formatting fixed to pass markdownlint.**

## 2025-07-13  PR #9

- **Summary**: fixed NOTES.md template and headings to satisfy markdownlint.
- **Stage**: documentation
- **Motivation / Decision**: avoid MD033 and long lines;
  keep history consistent.
- **Next step**: none.

<!-- markdownlint-disable-next-line MD024 -->
## 2025-07-13  PR #9

- **Summary**: cleaned TODO headings and spacing to pass markdownlint.
- **Stage**: documentation
- **Motivation / Decision**: keep TODO readable and linter-compliant.

## 2025-07-13  PR #10

- **Summary**: inserted blank line after the Development heading in README.
- **Stage**: documentation
- **Motivation / Decision**: follow lint rules; fix markdownlint MD022 error.
- **Next step**: none.

## 2025-07-14  PR #11

- **Summary**: updated AGENTS guide to v1.3 and added formatting rules.
- **Stage**: documentation
- **Motivation / Decision**: enforce consistent markdown
  and prevent future lint errors.
- **Next step**: none.

## 2025-07-14  PR #12

- **Summary**: excluded the CI workflow from conflict marker grep check.
- **Stage**: maintenance
- **Motivation / Decision**: avoid false positives when linting docs using a
  regex with `<{7}` style quantifiers.
- **Next step**: none.

## 2025-07-14  PR #13

- **Summary**: updated AGENTS guide to v1.5 and clarified how to quote
  conflict markers in docs.
- **Stage**: documentation
- **Motivation / Decision**: keep contributor rules clear so docs never
  trigger the grep check.
- **Next step**: none.

## 2025-07-14  PR #14

- **Summary**: updated AGENTS guide to v1.6 and explained using `<{7}` style
  placeholders for conflict markers.
- **Stage**: documentation
- **Motivation / Decision**: avoid grep failures
  when mentioning markers in docs.
- **Next step**: none.

## 2025-07-14  PR #15

- **Summary**: marked CI secret-check task as done and added note in history.
- **Stage**: documentation
- **Motivation / Decision**: CI already runs a `secret-check` job so the TODO
  item was completed.

## 2025-07-14  PR #16

- **Summary**: added .gitignore and updated guides and roadmap.
- **Stage**: documentation
- **Motivation / Decision**: enforce ignoring build paths; document the rule.

## 2025-07-14  PR #17

- **Summary**: added generated/README and updated AGENTS
  with make generate instructions.
- **Stage**: documentation
- **Motivation / Decision**: define ownership of generated files
  and guide regeneration.
- **Next step**: implement the generation script.

## 2025-07-14  PR #18

- **Summary**: setup script now installs requirements and npm packages.
- **Stage**: implementation
- **Motivation / Decision**: simplify bootstrap by bundling dependency install
  with toolchain setup.
- **Next step**: none.

## 2025-07-14  PR #19

- **Summary**: added generation script and make target; updated guides/tests.
- **Stage**: implementation
- **Motivation / Decision**: needed make generate to
  create placeholder outputs via scripts/generate.py.

## 2025-07-14  PR #20

- **Summary**: ticked TODO for .gitignore after verifying file exists.
- **Stage**: maintenance
- **Motivation / Decision**: keep roadmap accurate once task was complete.
- **Next step**: none.

## 2025-07-14  PR #21

- **Summary**: updated AGENTS guide to v1.9 adding lint-docs reminder for NOTES/TODO.
- **Stage**: documentation
- **Motivation / Decision**: ensure log files stay within line length
  by prompting `make lint-docs`.

## 2025-07-14  PR #22

- **Summary**: fixed long lines in NOTES so markdownlint passes.
- **Stage**: maintenance
- **Motivation / Decision**: keep history linter-compliant.
- **Next step**: none.

## 2025-07-14  PR #23

- **Summary**: fixed markdownlint failures and updated AGENTS
  to remind linting all docs.
- **Stage**: maintenance
- **Motivation / Decision**: keep CI green by enforcing doc linting.
- **Next step**: none.

### 2025-07-14  PR #24

- **Summary**: AGENTS guide now points to CODING_RULES and version bumped.
- **Stage**: documentation
- **Motivation / Decision**: follow newly added coding rules doc.
- **Next step**: none.

### 2025-07-14 mediapipe downgrade

- **Summary**: downgraded mediapipe to 0.10.13 so numpy 2 works;
   added dependency note in README.
- **Stage**: maintenance
- **Motivation / Decision**: mediapipe 0.10.21 required numpy<2;
  earliest PyPI wheel supporting numpy 2 is 0.10.13.
- **Next step**: monitor mediapipe releases for numpy 2 default.

## 2025-07-14  PR #25

- **Summary**: AGENTS v1.12 instructs verifying pinned package versions exist.
- **Stage**: documentation
- **Motivation / Decision**: ensure pinned dependencies point to real versions.
- **Next step**: add tooling to automate the check.

### 2025-07-14  PR #26

- **Summary**: added script to update TODO header date with make target and tests.
- **Stage**: implementation
- **Motivation / Decision**: automate roadmap timestamp per roadmap item.

## 2025-07-14  PR #27

- **Summary**: updated TypeScript dev dependency to 5.5.4.
- **Stage**: maintenance
- **Motivation / Decision**: keep tooling current for bug fixes.
- **Next step**: none.

## 2025-07-15  PR #28

- **Summary**: fixed bullet indentation, README spacing and bumped AGENTS to v1.13.
- **Stage**: documentation
- **Motivation / Decision**: keep markdownlint green and clarify nested list style.
- **Next step**: none.

## 2025-07-15  PR #29

- **Summary**: added script to verify pinned dependency versions with make target.
- **Stage**: implementation
- **Motivation / Decision**: automate version checks to enforce pin policy.
- **Next step**: watch for version conflicts in future updates.

### 2025-07-15  PR #30

- **Summary**: added ruff lint step and updated docs.
- **Stage**: implementation
- **Motivation / Decision**: enforce Python style with ruff to catch errors early.

### 2025-07-16  PR #31

- **Summary**: added MIT LICENSE file and updated README with license section.
- **Stage**: documentation
- **Motivation / Decision**: clarify project licensing.

### 2025-07-16  PR #32

- **Summary**: added negative tests for generation and todo-date scripts.
- **Stage**: testing
- **Motivation / Decision**: ensure scripts fail with bad permissions or
  malformed headers.

## 2025-07-16  PR #33

- **Summary**: documented script public functions with params, returns and raises.
- **Stage**: documentation
- **Motivation / Decision**: follow CODING_RULES rule 18 to improve clarity.
- **Next step**: none.

### 2025-07-17  PR #34

- **Summary**: fixed markdownlint issues in AGENTS and NOTES.
- **Stage**: documentation
- **Motivation / Decision**: keep docs lint-clean with wrapped lines.

### 2025-07-16  PR #35

- **Summary**: added markdown blank line rule to AGENTS
and fixed Makefile lint command.
- **Stage**: documentation
- **Motivation / Decision**: keep contributor guide accurate
and ensure ruff works with current version.
- **Next step**: none.

### 2025-07-17  PR #36

- **Summary**: pinned websockets and updated README and TODO.
- **Stage**: maintenance
- **Motivation / Decision**: prepare for upcoming WebSocket features.
- **Next step**: none.

### 2025-07-18  PR #37

- **Summary**: ticked TODO item for websockets pin after confirming README and
  requirements list version 15.0.1.
- **Stage**: maintenance
- **Motivation / Decision**: keep roadmap accurate with repository state.
- **Next step**: none.

### 2025-07-14  PR #38

- **Summary**: implemented MediaPipe pose detector and FastAPI WebSocket server.
- **Stage**: implementation
- **Motivation / Decision**: needed backend to stream 17 keypoints per frame.

- **Summary**: added React PoseViewer, WebSocket hook, metrics panel and tests.
- **Stage**: feature
- **Motivation / Decision**: implement basic frontend per tech challenge.
- **Next step**: expand pose metrics and UI features.

### 2025-07-18  PR #39

- **Summary**: added analytics module for angle and balance, WebSocket server and
  docs.
- **Stage**: implementation
- **Motivation / Decision**: integrate backend metrics to follow tech
  challenge.
- **Next step**: none.

## 2025-07-14  PR #40

- **Summary**: added running instructions to README and updated AGENTS with
  test setup bullet.
- **Stage**: documentation
- **Motivation / Decision**: clarify how to start backend and frontend locally
  and note that tests require dependencies from setup.
- **Next step**: none.

- **Summary**: Payload now includes landmarks; updated frontend and tests.
- **Stage**: implementation
- **Motivation / Decision**: align message structure for pose viewer rendering.
- **Next step**: none.

### 2025-07-19  PR #42

- **Summary**: added uvicorn entrypoint; updated docs and tests.
- **Stage**: implementation
- **Motivation / Decision**: allow `python -m backend.server` and check startup.
- **Next step**: none.

### 2025-07-14  PR #43

- **Summary**: PoseViewer requests webcam with cleanup; tests mock the stream.
- **Stage**: implementation
- **Motivation / Decision**: used webcam mock; jest-mock-media unavailable.
- **Next step**: none.

### 2025-07-18  PR #44

- **Summary**: updated metrics to use side-specific landmarks and added tests.
- **Stage**: implementation
- **Motivation / Decision**: analytics handle side names and missing points.
- **Next step**: none.

### 2025-07-19  PR #45

- **Summary**: marked PoseViewer and analytics tasks done.
- **Stage**: maintenance
- **Motivation / Decision**: keep roadmap accurate now that features exist.
- **Next step**: verify integration in upcoming releases.

### 2025-07-19  PR #46

- **Summary**: bumped AGENTS guide to v1.17 with MD031 and MD034 notes.
- **Stage**: documentation
- **Motivation / Decision**: keep coding style rules accurate.

### 2025-07-20  PR #47

- **Summary**: improved README formatting around
local run instructions and fixed ruff import order.
- **Stage**: maintenance
- **Motivation / Decision**: docs needed spacing tweaks
and lint failed; moved imports to top.
- **Next step**: none.

### 2025-07-14  PR #48

- **Summary**: ticked roadmap item documenting how to run backend and frontend.
- **Stage**: documentation
- **Motivation / Decision**: README already explains local setup;
keep TODO aligned.
- **Next step**: none.

### 2025-07-14  PR #49

- **Summary**: trimmed blank line and shortened history lines.
- **Stage**: maintenance
- **Motivation / Decision**: keep NOTES lint-compliant.
- **Next step**: none.

### 2025-07-14  PR #50

- **Summary**: enforced test coverage via pytest-cov and pinned version.
- **Stage**: maintenance
- **Motivation / Decision**: ensure tests check coverage ≥80%; tick roadmap.
- **Next step**: monitor CI and expand tests.

### 2025-07-14  PR #51

- **Summary**: added Sphinx docs build and make docs command.
- **Stage**: implementation
- **Motivation / Decision**: roadmap item for full doc build; need local HTML docs.
- **Next step**: none.

### 2025-07-14  PR #52

- **Summary**: added CI job to check dependency versions.
- **Stage**: maintenance
- **Motivation / Decision**: ensure pinned packages exist; tick roadmap item.
- **Next step**: monitor results and update versions when needed.

### 2025-07-14  PR #53

- **Summary**: added pre-commit config with ruff,
  black and markdownlint; updated docs.
- **Stage**: implementation
- **Motivation / Decision**: automate linting per TODO item;
  pre-commit runs before each commit.
- **Next step**: integrate actionlint hook.

### 2025-07-14  PR #54

- **Summary**: added `main` function in backend server,
  to start uvicorn and wrote a startup test.
- **Stage**: implementation
- **Motivation / Decision**: run the API with,
  `python -m backend.server`; ticked roadmap entrypoint task.
- **Next step**: none.

### 2025-07-14  PR #55

- **Summary**: WebSocket payload now returns landmarks list with metrics.
- **Stage**: implementation
- **Motivation / Decision**: needed richer message for frontend;
  updated tests accordingly.
- **Next step**: none.

### 2025-07-14  PR #56

- **Summary**: README gained "Running locally" section and TODO item for docs.
- **Stage**: documentation
- **Motivation / Decision**: show how to start backend and frontend together.
- **Next step**: mark task done when verified.

### 2025-07-14  PR #57

- **Summary**: cleaned NOTES formatting so headers follow lint rules.
- **Stage**: maintenance
- **Motivation / Decision**: remove stray blank line before header.
- **Next step**: none.

### 2025-07-14  PR #58

- **Summary**: marked local run docs TODO as complete and adjusted test imports.
- **Stage**: maintenance
- **Motivation / Decision**: keep roadmap accurate and satisfy ruff.
- **Next step**: none.

### 2025-07-14  PR #59

- **Summary**: improved code block spacing in README for markdownlint.
- **Stage**: documentation
- **Motivation / Decision**: keep README lint‑compliant after adding run guide.
- **Next step**: none.

### 2025-07-14  PR #60

- **Summary**: bumped AGENTS guide to v1.17 and added MD031 and MD034 style notes.
- **Stage**: documentation
- **Motivation / Decision**: document fenced block spacing and avoid bare URLs.
- **Next step**: none.

### 2025-07-14  PR #61

- **Summary**: introduced Sphinx docs build and added make docs target.
- **Stage**: implementation
- **Motivation / Decision**: roadmap item for full documentation build.
- **Next step**: none.

### 2025-07-14  PR #62

- **Summary**: enforced coverage threshold in Makefile and CI via pytest-cov.
- **Stage**: maintenance
- **Motivation / Decision**: ensure tests keep ≥80% coverage;
updated requirements and workflow.
- **Next step**: watch CI stability.

### 2025-07-14  PR #63

- **Summary**: added webcam toggle button with tests.
- **Stage**: implementation
- **Motivation / Decision**: allow users to start or stop webcam
  streaming from the UI.

### 2025-07-14  PR #64

- **Summary**: added pose classification metric and updated server, UI and docs.
- **Stage**: implementation
- **Motivation / Decision**: feature request to distinguish standing vs sitting
  using hip and knee angles.
- **Next step**: none.

### 2025-07-14  PR #65

- **Summary**: added actionlint hook in pre-commit and documented it.
- **Stage**: maintenance
- **Motivation / Decision**: enforce GitHub Actions linting consistently.
- **Next step**: monitor CI for actionlint findings.

### 2025-07-14  PR #66

- **Summary**: added actionlint and markdown link check jobs in CI.
- **Stage**: maintenance
- **Motivation / Decision**: fulfill TODO item for workflow validation and link checking.

### 2025-07-14  PR #67

- **Summary**: updated backend server command to `python -m backend.server` in README.
- **Stage**: documentation
- **Motivation / Decision**: keep instructions aligned with server entry point.
- **Next step**: none.

### 2025-07-14  PR #68

- **Summary**: clarified localhost link handling and updated AGENTS guide.
- **Stage**: documentation
- **Motivation / Decision**: avoid markdown-link-check failures on local URLs.

### 2025-07-14  PR #69

- **Summary**: fixed quoting in CI secret-check step.
- **Stage**: maintenance
- **Motivation / Decision**: ensure variable expansion works in GitHub Actions.

### 2025-07-14  PR #70

- **Summary**: fixed trailing spaces and wrapped long line in NOTES.
- **Stage**: maintenance
- **Motivation / Decision**: keep docs lint-compliant.
- **Next step**: none.

### 2025-07-14  PR #71

- **Summary**: README link to open frontend now ends with a trailing slash.
- **Stage**: documentation
- **Motivation / Decision**: match lychee ignore pattern to avoid link check errors.

### 2025-07-14  PR #72

- **Summary**: added `.lycheeignore` for localhost links and tweaked CI arguments.
- **Stage**: maintenance
- **Motivation / Decision**: keep markdown link check stable.
- **Next step**: none.

### 2025-07-14  PR #73

- **Summary**: setup script now installs `pre-commit` automatically.
- **Stage**: implementation
- **Motivation / Decision**: avoid missing hook installation instructions.
- **Next step**: none.

### 2025-07-14  PR #74

- **Summary**: lowered branch coverage requirement in CODING_RULES to 80%.
- **Stage**: documentation
- **Motivation / Decision**: align coding rules with CI coverage threshold.

### 2025-07-14  PR #75

- **Summary**: removed "future" from README test instruction.
- **Stage**: documentation
- **Motivation / Decision**: clarify that tests already exist.

### 2025-07-14  PR #76

- **Summary**: updated README to note existing FastAPI server and React app.
- **Stage**: documentation
- **Motivation / Decision**: remove outdated sentence to reflect repo status.
- **Next step**: none.

### 2025-07-15  PR #77

- **Summary**: setup script now installs pre-commit hooks
automatically and docs updated.
- **Stage**: documentation
- **Motivation / Decision**: remove manual step from contributor guide and README.

### 2025-07-15  PR #78

- **Summary**: setup script installs pre-commit hooks and runs them once.
- **Stage**: implementation
- **Motivation / Decision**: ensure hooks are cached while network is
  available.

### 2025-07-15  PR #79

- **Summary**: setup script now prefetches pre-commit hooks.
- **Stage**: maintenance
- **Motivation / Decision**: fetch hooks during setup so later runs work offline.
- **Next step**: none.

### 2025-07-15  PR #-0

- **Summary**: trailing space removed from July 15 notes entry to satisfy markdownlint.
- **Stage**: maintenance
- **Motivation / Decision**: keep NOTES.md clean and pass markdownlint.
- **Next step**: none.

### 2025-07-15  PR #80

- **Summary**: added weekly Dependabot config and updated docs.
- **Stage**: implementation
- **Motivation / Decision**: follow pin policy and automate updates.
- **Next step**: monitor upcoming dependency PRs.

### 2025-07-15  PR #81

- **Summary**: WebSocket URLs now accept custom host/port with default 8000;
README documents example. Setup script can skip pre-commit.
- **Stage**: implementation
- **Motivation / Decision**: allow connecting to remote backends
and avoid setup failures in offline environments.

### 2025-07-15  PR #82

- **Summary**: added frontend entrypoint with `index.tsx`,
bundle script using esbuild and minimal `index.html`.
- **Stage**: implementation
- **Motivation / Decision**: needed standalone bundle to serve
PoseViewer easily.

### 2025-07-15  PR #83

- **Summary**: removed duplicate PoseViewer and analytics tasks from TODO.
- **Stage**: maintenance
- **Motivation / Decision**: keep roadmap concise and avoid repetition.
- **Next step**: none.

### 2025-07-16  PR #84

- **Summary**: setup script now caches pre-commit hooks
in `.pre-commit-cache`
  and README notes this for offline reuse.
- **Stage**: implementation
- **Motivation / Decision**: speed up hook installs and enable offline
  development.

### 2025-07-15  PR #85

- **Summary**: marked TODO for index.tsx entrypoint as done and refreshed date.
- **Stage**: documentation
- **Motivation / Decision**: keep roadmap in sync with completed work.
- **Next step**: none.

### 2025-07-15  PR #86

- **Summary**: CI now skips pre-commit hook installation using `SKIP_PRECOMMIT=1`;
  fixed AGENTS markdown formatting.
- **Stage**: maintenance
- **Motivation / Decision**: pre-commit fetch failed in CI without network;
  add note in guide and update workflow.
- **Next step**: none.

### 2025-07-15  PR #87

- **Summary**: created `docs/source/_static` directory
with `.gitkeep` to remove Sphinx warning.
- **Stage**: documentation
- **Motivation / Decision**: ensure `make docs` runs cleanly.

### 2025-07-15  PR #88

- **Summary**: removed deprecated backend main entrypoint and related tests.
- **Stage**: cleanup
- **Motivation / Decision**: unify backend launch through `backend.server`.

### 2025-07-15  PR #89

- **Summary**: replaced deprecated `globals` config in `jest.config.js` with a
  `transform` entry and reran tests.
- **Stage**: maintenance
- **Motivation / Decision**: remove ts-jest deprecation warning during
  `npm test`.
- **Next step**: none.

### 2025-07-15  PR #90

- **Summary**: added mypy type-checking step and improved analytics typing.
- **Stage**: implementation
- **Motivation / Decision**: enforce rule 16 via CI type checks.

### 2025-07-15  PR #91

- **Summary**: added black to lint step and formatted Python files.
- **Stage**: implementation
- **Motivation / Decision**: enforce consistent style using black in CI;
updated docs.
- **Next step**: none.

### 2025-07-15  PR #92

- **Summary**: pinned numpy 1.26.4 and updated README quick start.
- **Stage**: maintenance
- **Motivation / Decision**: keep dependencies compatible; check-versions passes.
- **Next step**: none.

### 2025-07-15  PR #93

- **Summary**: reformatted backend/analytics.py with black.
- **Stage**: maintenance
- **Motivation / Decision**: keep Python code style consistent.
- **Next step**: none.

### 2025-07-15  PR #94

- **Summary**: pose_endpoint now closes the MediaPipe pose detector and test
  confirms it.
- **Stage**: implementation
- **Motivation / Decision**: release resources properly after streaming.
- **Next step**: none.

### 2025-07-15  PR #95

- **Summary**: ignored mypy, pytest and ruff caches in `.gitignore`.
- **Stage**: maintenance
- **Motivation / Decision**: keep temporary caches out of version control.
- **Next step**: none.

### 2025-07-15  PR #96

- **Summary**: fixed devDependencies formatting and regenerated lock file.
- **Stage**: maintenance
- **Motivation / Decision**: align package.json
style with other entries and keep lock file in sync.
- **Next step**: none.

### 2025-07-15  PR #97

- **Summary**: setup script uses existing PRE_COMMIT_HOME if provided and guide updated.
- **Stage**: maintenance
- **Motivation / Decision**: permit custom pre-commit cache locations without override.

### 2025-07-15  PR #98

- **Summary**: README quick-start explains pre-commit setup and offline flag.
- **Stage**: documentation
- **Motivation / Decision**: guide contributors on fetching hooks and using
  `SKIP_PRECOMMIT=1` when network is not available.

### 2025-07-15  PR #99

- **Summary**: AGENTS guide sets PRE_COMMIT_HOME
using git rev-parse and explains hook cache.
- **Stage**: documentation
- **Motivation / Decision**: ensure pre-commit cache works
in subdirectories and avoid GitHub prompts after running setup.
- **Next step**: none.

### 2025-07-15  PR #100

- **Summary**: setup script caches pre-commit hooks with explicit config.
- **Stage**: maintenance
- **Motivation / Decision**: ensure hooks are installed before network cut.
- **Next step**: none.

### 2025-07-15  PR #101

- **Summary**: ruff now checks backend in Makefile lint.
- **Stage**: maintenance
- **Motivation / Decision**: keep Python lint consistent across directories.

### 2025-07-15  PR #102

- **Summary**: pose_endpoint now creates and closes MediaPipe
Pose internally; tests handle multiple connections.
- **Stage**: implementation
- **Motivation / Decision**: avoid leaking resources
by reinitialising the pose detector per connection.
- **Next step**: add robustness tests for repeated WebSocket sessions.

### 2025-07-15  PR #103

- **Summary**: README and AGENTS guide emphasise running `./.codex/setup.sh`
  before tests.
- **Stage**: documentation
- **Motivation / Decision**: contributors skipped setup which made
  `make test` fail, so the docs now highlight this requirement.
- **Next step**: none.

### 2025-07-15  PR #104

- **Summary**: pinned pytest to 8.2.0 to keep tests stable.
- **Stage**: maintenance
- **Motivation / Decision**: ensures CI uses known version.
- **Next step**: none.

### 2025-07-15  PR #105

- **Summary**: robustness tests confirm multiple `/pose` connections work
  reliably and README highlights running `./.codex/setup.sh` before tests.
- **Stage**: maintenance
- **Motivation / Decision**: ensure stable WebSocket handling and guide
  contributors to run setup so tests pass.
- **Next step**: none.

### 2025-07-15  PR #106

- **Summary**: skeleton overlay connects landmarks with predefined edges and
  tests verify line drawing. README mentions the new overlay.
- **Stage**: feature
- **Motivation / Decision**: show pose structure on video and guard against
  regressions.

### 2025-07-15  PR #107

- **Summary**: server now sends 17 keypoints using `PoseDetector.process` and
  closes the detector after streaming. Payload building and tests were updated to
  expect exactly 17 points.
- **Stage**: feature
- **Motivation / Decision**: align streamed data with 17-point skeleton per
  tech challenge, ensure resources released properly.

### 2025-07-16  PR #108

- **Summary**: metrics panel now shows knee angle with tests and docs example.
- **Stage**: implementation
- **Motivation / Decision**: display full analytics to users per feature request.
- **Next step**: none.

### 2025-07-16  PR #109

- **Summary**: WebSocket hook now exposes connection status
and PoseViewer displays it.
- **Stage**: implementation
- **Motivation / Decision**: give users feedback on
backend connectivity; tests cover open and close events.

### 2025-07-16  PR #110

- **Summary**: Pose detector now selects 17 explicit landmarks; edges and tests
  updated accordingly.
- **Stage**: implementation
- **Motivation / Decision**: align keypoint order with tech challenge and expose
  named mapping across backend and frontend.
- **Next step**: none.

### 2025-07-16  PR #111

- **Summary**: Setup script installs hooks using `python3 -m pre_commit`.
- **Stage**: maintenance
- **Motivation / Decision**: avoid PATH issues when `pre-commit` is not on PATH.
- **Next step**: none.

### 2025-07-16  PR #112

- **Summary**: README explains optional host and port for `useWebSocket` and
  shows how to connect to a remote server.
- **Stage**: documentation
- **Motivation / Decision**: clarify remote backend usage.

### 2025-07-16  PR #113

- **Summary**: Document that setup script runs pre-commit on all files.
- **Stage**: documentation
- **Motivation / Decision**: remind contributors that initial formatting happens
  automatically.

### 2025-07-16  PR #114

- **Summary**: Makefile lint ignores build artefacts; lint-docs is faster.
- **Stage**: maintenance
- **Motivation / Decision**: speed up docs-only checks and avoid false positives.

### 2025-07-16  PR #115

- **Summary**: Add test for resolveUrl custom host and port.
- **Stage**: testing
- **Motivation / Decision**: ensure custom host and port work as expected.

### 2025-07-16  PR #116

- **Summary**: Formatted Sphinx config with Black and updated Makefile to
  lint docs.
- **Stage**: maintenance
- **Motivation / Decision**: keep documentation Python files consistent and
  ensure lint checks them.

### 2025-07-16  PR #117

- **Summary**: Added edge case test for PoseDetector when no landmarks are found.
- **Stage**: testing
- **Motivation / Decision**: reach 100% coverage of pose_detector module.

### 2025-07-16  PR #118

- **Summary**: Removed httpx pin from requirements; verified all other pins.
- **Stage**: maintenance
- **Motivation / Decision**: dependency unused so cleaned up to reduce overhead.

### 2025-07-16  PR #119

- **Summary**: Added `.markdownlintignore` and mentioned it in `AGENTS.md`.
- **Stage**: maintenance
- **Motivation / Decision**: speed up markdown linting by skipping build folders.

### 2025-07-16  PR #120

- **Summary**: package.json enforces Node 20 and README quick-start mentions
  the requirement.
- **Stage**: maintenance
- **Motivation / Decision**: ensure contributors use the same Node version as
  the setup script and document this prerequisite.

### 2025-07-16  PR #121

- **Summary**: refreshed TODO header date via script.
- **Stage**: maintenance
- **Motivation / Decision**: keep roadmap timestamp accurate.
- **Next step**: none.

### 2025-07-16  PR #122

- **Summary**: README clarifies build only outputs bundle.js.
  `index.html` is already there.
- **Stage**: documentation
- **Motivation / Decision**: correct outdated build instructions.

### 2025-07-16  PR #123

- **Summary**: added TypeScript type checking via `make typecheck-ts` and CI step.
- **Stage**: implementation
- **Motivation / Decision**: ensure frontend code passes `tsc` before commit.
- **Next step**: none.

### 2025-07-16  PR #124

- **Summary**: added repo_checks.py for trailing spaces and NOTES order.
- **Stage**: implementation
- **Motivation / Decision**: enforce log order and whitespace via pre-commit.
- **Next step**: none.

### 2025-07-16  PR #125

- **Summary**: Inserted blank line after PR #117 heading for markdownlint.
- **Stage**: documentation
- **Motivation / Decision**: maintain consistent log formatting.

### 2025-07-16  PR #126

- **Summary**: restored Black check for docs in Makefile.
- **Stage**: maintenance
- **Motivation / Decision**: AGENTS guide
 states docs Python must be formatted with Black,
but the lint step lost this path.
- **Next step**: none.

### 2025-07-16  PR #127

- **Summary**: lint-docs grep now skips build and cache dirs; documented in
  AGENTS.
- **Stage**: maintenance
- **Motivation / Decision**: avoid false positives from node_modules.

### 2025-07-16  PR #128

- **Summary**: added zero-length vector test for `calculate_angle`.
- **Stage**: testing
- **Motivation / Decision**: ensure overlapping points raise `ValueError`.
- **Next step**: none.

### 2025-07-16  PR #129

- **Summary**: `pose_endpoint` now runs frame capture and pose detection in
  threads and closes the WebSocket on errors. Added a regression test for
  concurrent clients.
- **Stage**: maintenance
- **Motivation / Decision**: prevent event loop blocking when multiple
  clients connect and ensure graceful shutdown.

### 2025-07-16  PR #130

- **Summary**: lint-docs grep now skips node_modules, .pre-commit-cache,
  frontend/dist and docs/_build to align with AGENTS.
- **Stage**: maintenance
- **Motivation / Decision**: avoid false positives in CI.

### 2025-07-16  PR #131

- **Summary**: fixed `lint-docs` rule indentation so Makefile executes.
- **Stage**: maintenance
- **Motivation / Decision**: Makefile failed due to spaces; used tabs instead.
- **Next step**: none.

### 2025-07-16  PR #132

- **Summary**: documented performance tests in AGENTS and README.
- **Stage**: maintenance
- **Motivation / Decision**: keep guides up to date with new test suite.
- **Next step**: plan CI stage for performance metrics.

### 2025-07-16  PR #133

- **Summary**: added pose accuracy test skeleton and dataset instructions.
- **Stage**: implementation
- **Motivation / Decision**: track pose prediction performance
  with optional sample data.
- **Next step**: populate dataset with real frames.

### 2025-07-16  PR #134

- **Summary**: added integration test for webcam reading at least one frame.
- **Stage**: testing
- **Motivation / Decision**: test pose_endpoint with a mocked webcam frame.

### 2025-07-16  PR #135

- **Summary**: added regression tests for pose_endpoint error handling.
- **Stage**: testing
- **Motivation / Decision**: verify WebSocket sends proper
errors and maintains coverage.

### 2025-07-16  PR #136

- **Summary**: added performance test using dummy webcam and detector.
- **Stage**: testing
- **Motivation / Decision**: ensure pose_endpoint handles frames at 20 FPS and
  WebSocket latency below 200 ms.
- **Next step**: none.

### 2025-07-17  PR #137

- **Summary**: pinned black in requirements and updated docs for skipping hooks.
- **Stage**: maintenance
- **Motivation / Decision**: ensure `make lint` works when pre-commit hooks are
  skipped.
- **Next step**: none.

### 2025-07-17  PR #138

- **Summary**: setup script now runs `pyenv rehash` after installing packages.
- **Stage**: maintenance
- **Motivation / Decision**: ensure pyenv shims pick up new Python binaries.

### 2025-07-17  PR #139

- **Summary**: skip pose accuracy test when placeholder dataset has no landmarks.
- **Stage**: testing
- **Motivation / Decision**: avoid false failures when default samples lack
  landmarks.

### 2025-07-17  PR #140

- **Summary**: clarified placeholder test data in README and AGENTS.
- **Stage**: documentation
- **Motivation / Decision**: docs wrongly asked users to add files manually.
- **Next step**: none.

### 2025-07-17  PR #141

- **Summary**: added Pages workflow to publish docs when GH_PAGES_TOKEN is set.
- **Stage**: implementation
- **Motivation / Decision**: automate deployment to GitHub Pages per TODO.
- **Next step**: none.

### 2025-07-17  PR #142

- **Summary**: added feature_a documentation and linked it from README.
- **Stage**: documentation
- **Motivation / Decision**: capture assumptions and edge cases for the first
  feature as required by TODO.
- **Next step**: plan implementation and tests for feature A.

### 2025-07-17  PR #143

- **Summary**: CI now tests Python 3.11 and 3.12 via a matrix and setup script
  reads PYTHON_VERSION.
- **Stage**: maintenance
- **Motivation / Decision**: verify compatibility across versions with minimal
  workflow changes.
- **Next step**: none.

### 2025-07-17  PR #144

- **Summary**: added Dockerfile and container guide to document optional
  container workflow.
- **Stage**: tooling
- **Motivation / Decision**: provide a reproducible dev environment.
- **Next step**: publish image to a registry.

### 2025-07-17  PR #145

- **Summary**: updated Pages workflow to artifact action v3; documented change.
- **Stage**: maintenance
- **Motivation / Decision**: keep deployment workflow current and documented.
- **Next step**: none.

### 2025-07-17  PR #146

- **Summary**: pinned mypy in requirements and documented the type check step.
- **Stage**: maintenance
- **Motivation / Decision**: ensure `make typecheck` works offline and update
  bootstrap docs.
- **Next step**: publish Docker image to a registry.

### 2025-07-17  PR #147

- **Summary**: removed obsolete Jekyll workflow for old docs.
- **Stage**: maintenance
- **Motivation / Decision**: Docs use Sphinx; old Jekyll workflow confused devs.

### 2025-07-17  PR #148

- **Summary**: added `actions/configure-pages@v5` step before building docs.
- **Stage**: maintenance
- **Motivation / Decision**: configure Pages before uploading.

### 2025-07-17  PR #149

- **Summary**: clarified streaming toggle in README and referenced PoseViewer logic.
- **Stage**: documentation
- **Motivation / Decision**: help developers understand the Start Webcam button behavior.

### 2025-07-17  PR #150

- **Summary**: clarified that Pages must be enabled with GitHub Actions as
  source and the token needs `pages:write` and repo access.
- **Stage**: documentation
- **Motivation / Decision**: ensure maintainers configure Pages before expecting
  deployments.

### 2025-07-17  PR #151

- **Summary**: backend now serves `frontend/dist` with FastAPI `StaticFiles`.
- **Stage**: feature
- **Motivation / Decision**: simplify local usage by mounting built assets at
  the root path. Still optional for manual hosting.

### 2025-07-17  PR #152

- **Summary**: added posture angle metric across backend and frontend.
- **Stage**: implementation
- **Motivation / Decision**: compute torso angle to display posture data.

### 2025-07-17  PR #153

- **Summary**: frontend shows WebSocket errors without overwriting pose data.
- **Stage**: feature
- **Motivation / Decision**: handle backend errors without losing pose data.

### 2025-07-17  PR #154

- **Summary**: set PoseDetector to dynamic mode and documented the improvement.
- **Stage**: implementation
- **Motivation / Decision**: lower latency using MediaPipe streaming mode.

### 2025-07-17  PR #155

- **Summary**: added PowerShell setup script, updated README and AGENTS.
- **Stage**: implementation
- **Motivation / Decision**: give Windows users an equivalent setup path and
  document manual alternatives for environments without PowerShell.

### 2025-07-17  PR #156

- **Summary**: documented Visual Studio 2022 setup for backend development.
- **Stage**: documentation
- **Motivation / Decision**: help Windows users create a venv.
  Set the server startup file.

### 2025-07-17  PR #157

- **Summary**: added note about npm or Python wrappers and Windows WSL/Docker hint.
- **Stage**: documentation
- **Motivation / Decision**: help users who lack `make` or run on Windows.
- **Next step**: none.

### 2025-07-17  PR #158

- **Summary**: fixed setup.ps1 so PowerShell 5.1 accepts parameters.
- **Stage**: implementation
- **Motivation / Decision**: PS 5.1 lacks the ternary operator; changed to if/else.
- **Next step**: none.

### 2025-07-17  PR #159

- **Summary**: PoseViewer now shows "Webcam access denied" if camera
  permissions fail and the metrics panel is styled vertically.
- **Stage**: implementation
- **Motivation / Decision**: improve user feedback when the browser blocks the
  webcam and make metrics easier to read.

### 2025-07-17  PR #160

- **Summary**: added PowerShell wrappers and npm scripts for Windows lint/test/docs.

- **Stage**: implementation
- **Motivation / Decision**: allow running lint, tests and docs without make on Windows.

### 2025-07-17  PR 161

- **Summary**: added `pymake.py` cross-platform wrapper and updated README.
- **Stage**: implementation
- **Motivation / Decision**: simplify running Make targets on Windows.

### 2025-07-17  PR #162

- **Summary**: added PowerShell wrappers for Makefile commands.
- **Stage**: implementation
- **Motivation / Decision**: allow Windows users to run lint, tests and docs
  without make.

### 2025-07-17  PR #163

- **Summary**: added close() to useWebSocket and tests, stop button now closes
  WebSocket and reconnection works; backend handles disconnect without errors.
- **Stage**: implementation
- **Motivation / Decision**: allow users to stop streaming cleanly and ensure
  resources release on client disconnect.
- **Next step**: none.

### 2025-07-17  PR #164

- **Summary**: canvas now resizes to the webcam video and tests cover the
  behaviour. Added README note and updated TODO.
- **Stage**: implementation
- **Motivation / Decision**: ensure overlay matches video resolution when the
  stream starts.
- **Next step**: none.

### 2025-07-18  PR #165

- **Summary**: added PowerShell wrappers for generate, lint-docs,
update-todo-date and check-versions via npm scripts.
- **Stage**: implementation
- **Motivation / Decision**: allow Windows users to run all Make tasks.

### 2025-07-18  PR #166

- **Summary**: CI now includes a Windows job running PowerShell wrappers.
- **Stage**: implementation
- **Motivation / Decision**: ensure lint, type checks and tests pass on Windows.

### 2025-07-18  PR #167

- **Summary**: added CSS for `.pose-container` to overlay the canvas on the
video and rebuilt the frontend bundle. README notes the new styling and
TODO logs the task.
- **Stage**: implementation
- **Motivation / Decision**: match user request for explicit container styling
  to ensure overlay alignment.
- **Next step**: none.

### 2025-07-18  PR #168

- **Summary**: moved PowerShell wrappers into `scripts/` and removed the old
  `scripts/windows` folder; updated docs.
- **Stage**: implementation
- **Motivation / Decision**: simplify wrapper usage and avoid duplicate scripts.
- **Next step**: none.

### 2025-07-18  PR #X169

- **Summary**: added tests for `pymake` and PowerShell wrappers to verify failure
  exit codes.
- **Stage**: testing
- **Motivation / Decision**: ensure cross-platform wrappers behave correctly and
  increase coverage.

### 2025-07-18  PR #170

- **Summary**: PowerShell wrapper scripts now exit if any external command fails.
- **Stage**: implementation
- **Motivation / Decision**: let Windows CI fail when lint or tests fail.

### 2025-07-18  PR #171

- **Summary**: added a table mapping Make targets to PowerShell wrappers in README.
- **Stage**: documentation
- **Motivation / Decision**: help Windows users find the equivalent commands quickly.
- **Next step**: none.

### 2025-07-20  PR #172

- **Summary**: documented `pymake.py` wrapper in AGENTS with dispatch info.
- **Stage**: documentation
- **Motivation / Decision**: help contributors run Make targets on any OS.

### 2025-07-18  PR #173

- **Summary**: pymake now checks for pwsh before powershell; tests updated.
- **Stage**: implementation
- **Motivation / Decision**: improve Windows compatibility.

### 2025-07-18  PR #174

- **Summary**: adjusted pymake to find PowerShell scripts relative to its file
  and added test for subdirectory usage.
- **Stage**: implementation
- **Motivation / Decision**: ensure wrapper works from any path per request.
- **Next step**: none.

### 2025-07-18  PR #175

- **Summary**: tests now use cmd stubs for Windows PowerShell wrappers.
- **Stage**: testing
- **Motivation / Decision**: ensure wrapper failure detection on Windows.
- **Next step**: none.

### 2025-07-18  PR #176

- **Summary**: test-win job now runs `python pymake.py lint` after `scripts\\lint.ps1`.
- **Stage**: implementation
- **Motivation / Decision**: mirror Windows lint steps to manual instructions.

### 2025-07-18  PR #177

- **Summary**: added `win:setup` npm script and updated README for Windows setup.
- **Stage**: documentation
- **Motivation / Decision**: provide easier bootstrap on Windows using npm.
- **Next step**: none.

### 2025-07-18  PR #178

- **Summary**: Metrics panel now wraps each metric in its own
  paragraph; tests updated and README clarified vertical display.
- **Stage**: implementation
- **Motivation / Decision**: improve readability by listing metrics on
  separate lines and keep docs consistent.

### 2025-07-18  PR #179

- **Summary**: coverage now includes `backend/server.py`.
- **Stage**: maintenance
- **Motivation / Decision**: cover server module; coverage remains above 80%.

### 2025-07-18  PR #180

- **Summary**: handled camera open failure in `pose_endpoint`.
- **Stage**: implementation
- **Motivation / Decision**: prevent hanging websocket when webcam unavailable.
- **Next step**: none.

### 2025-07-18  PR #181

- **Summary**: clarified README about passing only hostname/IP to
  `useWebSocket`.
- **Stage**: documentation
- **Motivation / Decision**: avoid confusion over protocol prefixes.

### 2025-07-18  PR #182

- **Summary**: camera release happens only once via finally block.
- **Stage**: implementation
- **Motivation / Decision**: avoid duplicate release when camera fails to open.

### 2025-07-18  PR #183

- **Summary**: lint and typecheck now include `pymake.py`; docs updated.
- **Stage**: implementation
- **Motivation / Decision**: ensure root scripts are covered by quality tools.
- **Next step**: none.

### 2025-07-19  PR #184

- **Summary**: clarified VS setup instructions.
  Added note on rerunning the setup script inside new virtual environments.
- **Stage**: documentation
- **Motivation / Decision**: help Windows users avoid missing packages when
  IDEs create `.venv` folders.
- **Next step**: none.

### 2025-07-19  PR #185

- **Summary**: moved static mount after routes to fix WebSocket endpoint order.
  Added test for route order.
- **Stage**: implementation
- **Motivation / Decision**: prevent StaticFiles from catching WebSocket traffic.
- **Next step**: none.

### 2025-07-19  PR #186

- **Summary**: server reads JPEG bytes from clients instead of webcam.
  Updated tests and kept WebSocket open until client disconnects.
- **Stage**: implementation
- **Motivation / Decision**: align backend with frontend streaming frames.

### 2025-07-19  PR #187

- **Summary**: PoseViewer now sends each webcam frame as a
  JPEG blob over the WebSocket.
  useWebSocket exposes a `send` method and parses binary messages. Tests updated.
- **Stage**: implementation
- **Motivation / Decision**: allow remote pose detection by streaming frames.
- **Next step**: none.

### 2025-07-19  PR #188

- **Summary**: updated docs/README to describe that the browser sends JPEG
  frames over `/pose` and the backend decodes them before running
  `PoseDetector`.
- **Stage**: documentation
- **Motivation / Decision**: keep documentation in sync after moving webcam
  capture to the client.
- **Next step**: none.

### 2025-07-20  PR #189

- **Summary**: removed fixed height from .pose-container so metrics panel
  shows below the video overlay; updated README.
- **Stage**: bugfix
- **Motivation / Decision**: CSS overlay hid metrics because container
  height restricted it; letting it grow exposes the panel.
- **Next step**: none.

### 2025-07-20  PR #190

- **Summary**: added alignCanvasToVideo helper to keep the overlay sized to the
  video and updated tests and docs.
- **Stage**: implementation
- **Motivation / Decision**: ensure the overlay resizes correctly when the video
  element scales, matching new TODO item.
- **Next step**: none.

### 2025-07-20  PR #191

- **Summary**: canvas overlay now respects device pixel ratio and handles
  mirroring via `ResizeObserver` in PoseViewer. Updated tests and README.
- **Stage**: implementation
- **Motivation / Decision**: improve drawing quality on high‑DPI screens and
  avoid resizing work on every frame.

### 2025-07-20  PR #192

- **Summary**: scaled PoseViewer canvas by `devicePixelRatio` and adjusted tests.
- **Stage**: implementation
- **Motivation / Decision**: ensure crisp rendering on high-DPI screens and
  verify scaling logic via Jest.
- **Next step**: none.

### 2025-07-20  PR #193

- **Summary**: moved context scaling from `alignCanvasToVideo` into the drawing
  effect. `alignCanvasToVideo` now only sizes the canvas. Updated pose drawing
  to use raw video coordinates and adjusted tests accordingly.
- **Stage**: implementation
- **Motivation / Decision**: simplify overlay logic and prepare for mirroring
  detection via `getComputedStyle`.

### 2025-07-20  PR #194

- **Summary**: added TODO item to refactor overlay scaling and update tests.
- **Stage**: planning
- **Motivation / Decision**: overlay sizing code is complex; refactor
  for maintainability and test coverage.
- **Next step**: implement refactor and adjust tests.

- ### 2025-07-20 PR #195

- **Summary**: updated PoseViewer docs to explain
  `alignCanvasToVideo` transform setup and device pixel ratio.
- **Stage**: documentation
- **Motivation / Decision**: keep README in sync with the scaling code.
- **Next step**: none.

### 2025-07-20  PR #196

- **Summary**: added test for mirroring via getComputedStyle.
- **Stage**: testing
- **Motivation / Decision**: verify overlay handles flipped video.

### 2025-07-20 PR #197

- **Summary**: documented `alignCanvasToVideo` and `drawSkeleton` with
  JSDoc comments. Updated README to match canvas resizing.
- **Stage**: documentation
- **Motivation / Decision**: help contributors understand overlay sizing
  and keep docs consistent with code.

### 2025-07-20  PR #198

- **Summary**: ticked overlay scaling refactor in TODO.
- **Stage**: documentation
- **Motivation / Decision**: refactor completed earlier; marked roadmap done.

### 2025-07-20  PR #199

- **Summary**: clarified that `alignCanvasToVideo` only sizes the canvas using `devicePixelRatio`.
- **Stage**: documentation
- **Motivation / Decision**: drop transform reference so README matches code.
- **Next step**: none.

### 2025-07-20  PR #200

- **Summary**: reset overlay transform before scaling and removed scaling from
  `drawSkeleton`. Updated tests accordingly.
- **Stage**: implementation
- **Motivation / Decision**: ensure consistent rendering after canvas resizes and
  simplify poseDrawing logic.

### 2025-07-20  PR #201

- **Summary**: converted normalized landmarks to pixels in `drawSkeleton` and
  applied line width scaling in `PoseViewer`. Updated docs and tests.
- **Stage**: implementation
- **Motivation / Decision**: fix incorrect overlay coordinates when using
  intrinsic video dimensions.

### 2025-07-20  PR #202

- **Summary**: removed line width assignment from `PoseViewer` and added a unit
  test verifying `drawSkeleton` handles scaling. Reason: avoid redundant
  `ctx.lineWidth` calls.
- **Stage**: implementation
- **Motivation / Decision**: keep drawing logic localized in `drawSkeleton`.

### 2025-07-20  PR #203

- **Summary**: use absolute scale from `getTransform` so line width stays
  positive when mirroring. Added test.
- **Stage**: implementation
- **Motivation / Decision**: ensure overlay drawing works after `ctx.scale(-1,1)`.
- **Next step**: none.

### 2025-07-21  PR #204

- **Summary**: fixed missing closing brace in `poseDrawing.test.tsx` so tests run.
- **Stage**: maintenance
- **Motivation / Decision**: previous refactor left an unclosed test block which
  broke Jest output.
- **Next step**: none.

### 2025-07-21  PR #205

- **Summary**: MetricsPanel now displays FPS and PoseViewer ensures fps is present.
- **Stage**: implementation
- **Motivation / Decision**: expose streaming rate for monitoring.
  Added defaulting logic.

### 2025-07-21  PR #206

- **Summary**: added FPS metric in backend payload and updated tests and docs.
- **Stage**: implementation
- **Motivation / Decision**: allow clients to monitor server frame rate.
- **Next step**: none.

### 2025-07-21  PR #207

- **Summary**: added `playsInline` to video and an `.overlay` class to canvas.
- **Stage**: implementation
- **Motivation / Decision**: playsInline allows autoplay on mobile and the
  overlay class simplifies styling.
- **Next step**: none.

### 2025-07-21  PR #208

- **Summary**: moved MetricsPanel below pose-container and clarified README.
  Built frontend.
- **Stage**: implementation
- **Motivation / Decision**: show metrics as sibling element so layout is clearer.
- **Next step**: none.

### 2025-07-21  PR #209

- **Summary**: added infer_ms and json_ms timing metrics to backend payload and
  updated tests and docs.
- **Stage**: implementation
- **Motivation / Decision**: expose inference and serialization times for
  performance debugging.

### 2025-07-21  PR #210

- **Summary**: measured frame encode and draw time, blob size, client FPS and
  dropped frames. Updated UI, docs and tests.
- **Stage**: implementation
- **Motivation / Decision**: expose client-side performance metrics for easier
  debugging and monitoring.
  - **Next step**: none.

### 2025-07-22  PR #211

- **Summary**: added inferMs and jsonMs metrics to MetricsPanel and wired them
  through PoseViewer. Updated tests and README.
- **Stage**: implementation
- **Motivation / Decision**: expose backend inference and serialization timings
  in the frontend for easier profiling.
- **Next step**: none.

### 2025-07-21  PR #212

- **Summary**: exposed model complexity via constant, WebSocket payload and UI.
- **Stage**: implementation
- **Motivation / Decision**: allow frontends to know if lite or full model runs.

### 2025-07-21  PR #213

- **Summary**: added timestamp-based latency metrics between client and server.
- **Stage**: implementation
- **Motivation / Decision**: measure network delays for troubleshooting.

### 2025-07-21  PR #214

- **Summary**: documented npm install in setup script and AGENTS guide.
- **Stage**: maintenance
- **Motivation / Decision**: ensure `make typecheck-ts` passes by installing
  Node packages.

### 2025-07-21  PR #215

- **Summary**: updated README and docs to list metrics exactly as the UI shows.
- **Stage**: documentation
- **Motivation / Decision**: docs listed outdated metrics; verified
  MetricsPanel.tsx and synced both READMEs.
- **Next step**: none.

### 2025-07-21  PR #216

- **Summary**: documented policy for optional packages in AGENTS guide.
- **Stage**: documentation
- **Motivation / Decision**: ensure new optional dependencies get pinned and described.
- **Next step**: none.

### 2025-07-21  PR #217

- **Summary**: added CPU and memory metrics via optional psutil with rolling
  averages.
- **Stage**: implementation
- **Motivation / Decision**: monitor backend resource usage and fulfil TODO.

### 2025-07-21  PR #218

- **Summary**: inserted `from __future__ import annotations` in tests and
  updated style guide.
- **Stage**: maintenance
- **Motivation / Decision**: union types require the future import on
  Python 3.9; tests were missing it.

### 2025-07-21  PR #219

- **Summary**: parse_requirements now strips trailing comments; tests cover it.
- **Stage**: implementation
- **Motivation / Decision**: avoid wrong version checks; resolves TODO.

### 2025-07-21  PR #220

- **Summary**: switched frame timestamps to epoch using Date.now()/time.time.
- **Stage**: implementation
- **Motivation / Decision**: align client-server clocks for accurate network metrics.

### 2025-07-21  PR #221

- **Summary**: refined metrics list in README and docs; removed duplicates.
- **Stage**: documentation
- **Motivation / Decision**: clarify metrics displayed in the UI.
- **Next step**: none.

### 2025-07-21  PR #222

- **Summary**: AGENTS guide bumped to v1.51 with note on patching env lookups.
- **Stage**: documentation
- **Motivation / Decision**: keep tests deterministic across CI runners.

### 2025-07-21  PR #223

- **Summary**: backend and docs expose average FPS metric `fps_avg`.
- **Stage**: implementation
- **Motivation / Decision**: provide smoother FPS reporting over a 30-frame window.

### 2025-07-25  PR #224

- **Summary**: fixed negative drawMs by using performance.now() for start and end.
- **Stage**: implementation
- **Motivation / Decision**: performance.now and Date.now were mixed causing
  negative timing; use one source for reliability.

### 2025-07-21  PR #225

- **Summary**: patched `test_pymake_works_from_subdirectory` to mock PowerShell
  detection.
- **Stage**: testing
- **Motivation / Decision**: make test deterministic regardless of installed
  executables.

### 2025-07-21  PR #226

- **Summary**: added rule requiring consistent clock source for duration measurement.
- **Stage**: documentation
- **Motivation / Decision**: avoid inconsistent timings; align coding guidelines.
- **Next step**: none.

### 2025-07-21  PR #227

- **Summary**: reduced frame interval to 50ms in PoseViewer for smoother video.
- **Stage**: implementation
- **Motivation / Decision**: 20 FPS target requires faster capture; tests updated.
- **Next step**: none.

### 2025-07-21  PR #228

- **Summary**: halved PoseViewer interval to 25ms for snappier streaming.
- **Stage**: implementation
- **Motivation / Decision**: higher 40 FPS target; updated test delays.
- **Next step**: none.

### 2025-07-21  PR #229

- **Summary**: linked Pages deployment, added docs overview and ticked TODO.
- **Stage**: documentation
- **Motivation / Decision**: show published docs and provide Sphinx overview.
- **Next step**: none.

### 2025-07-21  PR #230

- **Summary**: AGENTS guide advises using `<!-- lychee skip -->` for future links
  and checking relative paths after moving docs.
- **Stage**: documentation
- **Motivation / Decision**: avoid false link errors and ensure references stay
  valid.

### 2025-07-21  PR #231

- **Summary**: fixed Sphinx docs links to tech challenge file.
- **Stage**: documentation
- **Motivation / Decision**: markdown-link-check expected path from source dir.

### 2025-07-21  PR #232
- **Summary**: added lychee skip comment after Pages deployment link.
- **Stage**: documentation
- **Motivation / Decision**: ensure link checker passes for remote URL.
- **Next step**: none.
