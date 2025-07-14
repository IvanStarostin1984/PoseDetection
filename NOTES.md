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

## 2025-07-14  PR #29

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

## 2025-07-14  PR #33

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

### 2025-07-19  PR #40

- **Summary**: marked PoseViewer and analytics tasks done.
- **Stage**: maintenance
- **Motivation / Decision**: keep roadmap accurate now that features exist.
- **Next step**: verify integration in upcoming releases.
