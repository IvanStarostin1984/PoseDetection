# Engineering log  – append entries at **the end** (oldest → newest)

Each pull‑request **adds one new section** using the fixed template below.  
*Never modify or reorder previous entries.*  
Keep lines ≤ 80 chars and leave exactly **one blank line** between sections.

---

## TEMPLATE  (copy → fill → append)

### YYYY‑MM‑DD  PR #<number or draft>

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
- **Summary**: README now references docs/tech-challenge.txt as the guiding spec.
- **Stage**: documentation
- **Motivation / Decision**: clarify source of truth so future tasks align with the tech challenge.
- **Next step**: start implementing setup and lint/test commands.

## 2025-07-13  PR #-2
- **Summary**: added project overview and setup steps to README files.
- **Stage**: documentation
- **Motivation / Decision**: explain quick start and link to tech challenge.
- **Next step**: none.

## 2025-07-13  PR #-1
- **Summary**: added Makefile with lint and test tasks; updated docs to pass lint.
- **Stage**: implementation
- **Motivation / Decision**: provide initial developer workflow as planned in TODO.
- **Next step**: create setup script and start implementing core features.

## 2025-07-13  PR #0
- **Summary**: added setup script for Python and Node and updated README.
- **Stage**: implementation
- **Motivation / Decision**: needed bootstrap to install toolchains idempotently.
- **Next step**: define lint and test commands.

## 2025-07-13  PR #1
- **Summary**: added fail-fast CI workflow replicating template.
- **Stage**: implementation
- **Motivation / Decision**: align repo with AGENTS.md CI; ensures docs-only commits run markdown lint while code triggers tests.
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
- **Motivation / Decision**: keep guide current so contributors know to run local lint.
- **Next step**: none.

## 2025-07-13  PR #9
- **Summary**: cleaned TODO headings and spacing to pass markdownlint.
- **Stage**: documentation
- **Motivation / Decision**: keep TODO readable and linter-compliant.
- **Next step**: none.
