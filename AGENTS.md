# Contributor & CI Guide <!-- AGENTS.md v1.51 -->

> **Read this file first** before opening a pull‑request.
> It defines the ground rules that keep humans, autonomous agents and CI
in‑sync.
> If you change *any* rule below, **bump the version number in this heading**.

---
On each request read fully single source of truth.
Always follow single source of truth.
Always do as specified in single source of truth.
If something is not specified in single source of truth -
choose simplest safest options.
Implement project as specified in TODO.md. Reflect on progress in NOTES.md.
When any issue in codex environment happens,
always suggest additions/modifications to this AGENTS.md
to prevent such issues in future.
Maintain and develop the project
 so that after each new feature user will be able to download github repo
and run in local IDE to test manually.
Follow the coding rules described in `CODING_RULES.md`.
Do not base any decision on .md documentation only,
if code files are present in repo - always reverify
document information in code files.

## 1 · File-ownership & merge-conflict safety

- **Distinct-files rule** – Every concurrent task must edit a unique list of
  non-markdown files. Shared exceptions: anyone may append (never rewrite)
  `AGENTS.md`, `TODO.md`, `NOTES.md`.
- **Append-only logs** – `TODO.md` & `NOTES.md` are linear logs—never delete or
  reorder entries. Add new items at the end of the file.
- `scripts/repo_checks.py` verifies `NOTES.md` dates stay in ascending order.
- **Generated-files rule** – Anything under `generated/**` or `openapi/**` is
  code-generated—never hand-edit; instead rerun the generator.
- **.gitignore discipline** – Paths listed there must never be committed.
  code-generated. Run `make generate` (calls `python scripts/generate.py`)
  to recreate them and keep these files out of regular commits unless
  intentionally updating the outputs.
- Sample frames for pose accuracy tests are stored in `tests/data/`.
- Placeholder PNG images and a `labels.json` file are provided.
- Replace them with real frames to run the accuracy test; otherwise it skips.
- **Search for conflict markers before every commit** –
  `git grep -n -E '<{7}|={7}|>{7}'` must return nothing.
- **Never include conflict markers verbatim** –
  mention them as `<{7}`, `={7}` or `>{7}` to keep grep quiet.

---

## Shared environment

shell: |
  REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
  export PRE_COMMIT_HOME="${PRE_COMMIT_HOME:-$REPO_ROOT/.pre-commit-cache}"

Running `.codex/setup.sh` downloads hooks into this directory and
prevents GitHub prompts.

## 2 · Bootstrap (first-run) checklist

1. Run `.codex/setup.sh` (or `./setup.sh`) once after cloning & whenever
   dependencies change. Windows users can run `scripts/setup.ps1` in
   PowerShell. *The script installs Python, Node and all packages needed for
   tests, running `npm install` so `make typecheck-ts` works.* Set
   `PYTHON_VERSION` or `NODE_VERSION` to override the defaults (3.11 and 20).
   Always complete this step before running any test or build.
2. Run the setup script inside your active Python environment. IDEs may
   create a new `.venv`, so rerun it there (or `pip install -r requirements.txt`)
   before starting the backend.
3. Export **required secrets** (`GIT_TOKEN`, `GH_PAGES_TOKEN`, …)
   in the repository/organisation **Secrets** console.
4. Verify the **secret‑detection helper step** in
    `.github/workflows/ci.yml` (see § 4) so forks without secrets still pass.
5. Pushes to `main` run `.github/workflows/pages.yml` which builds the Sphinx
   docs, uploads them using `actions/upload-pages-artifact@v3` and deploys them
   to GitHub Pages when `GH_PAGES_TOKEN` is present. Enable Pages in the repo
   settings with **GitHub Actions** as the source. `GH_PAGES_TOKEN` requires
   `pages:write` and repo access.
6. On the first PR, update README badges to point at your fork (owner/repo).
7. `.codex/setup.sh` installs `pre-commit`, sets up the hooks and then runs
   `pre-commit run --all-files`. This may reformat files, so run the script
   before editing anything. Hooks are installed using `python3 -m pre_commit`
   on the first run to avoid PATH issues. Set `SKIP_PRECOMMIT=1` to bypass this
   when offline. The CI workflow passes this flag because the runners have
   restricted network access.
8. `black` is pinned in `requirements.txt` so `make lint` works when
   pre-commit hooks are skipped.
9. `mypy` is pinned in `requirements.txt` so `make typecheck` works.
10. When using pyenv, run `pyenv rehash` after package installs so new
   shims are picked up.
11. A `Dockerfile` sets up Python 3.11 and Node 20. Build it with
   `docker build -t posedetect .` to run tests in a container.
12. Run `python pymake.py <target>` when `make` is unavailable. The wrapper
    calls `make` on Unix and the PowerShell scripts on Windows.
13. Windows users without `make` can still run the wrappers via
    `npm run win:lint` or directly from `scripts/<name>.ps1` (for example
    `scripts/lint.ps1`).

---

## 3 · What every contributor must know up-front

1. **Branch & PR flow** – fork → `feat/<topic>` → PR into `main`
   (one reviewer required).
2. **Pre‑commit commands** (also run by CI):

    ```bash
    make lint                  # all format / static‑analysis steps
    make typecheck             # mypy static type checking
    make typecheck-ts          # TypeScript compile check
    make test                  # unit/integration + perf tests; coverage ≥80%
    python3 -m pre_commit run --files <changed>
    ```

    - For docs-only changes run `make lint` (or `make lint-docs`) before committing.
    - When updating `NOTES.md` or `TODO.md` run `make lint-docs` to
      catch long-line issues locally.
    - After editing `TODO.md` also run `make update-todo-date` to refresh
   the header date.
    - Always run `make lint-docs` after editing any Markdown file
      to avoid CI failures.
    - `make lint-docs` only runs `markdownlint` and a conflict marker check,
    - If it fails with binary file matches, delete `node_modules/` and
      `.pre-commit-cache/` before rerunning. The check skips
      `node_modules`, `.pre-commit-cache`,
      `frontend/dist` and `docs/_build`.
    - Run `make check-versions` when changing dependencies to
      verify pinned versions exist. CI runs this automatically when
      `requirements.txt`, `package.json` or `package-lock.json` change.
    - When adding optional packages (e.g. `psutil`) mention them in README
      and run `make check-versions` to validate the pin.
    - Run `make docs` to build the HTML docs into `docs/_build`.
    - Markdownlint reads `.markdownlintignore` to skip build and cache dirs.
    - `make lint` runs `ruff` across all Python sources, including
      `backend/`, `scripts/`, `tests/` and root scripts like `pymake.py`.
    - Static type checking uses mypy via `make typecheck` on those same files.
    - TypeScript compile checks run via `make typecheck-ts`.
    - `black` formats `backend/`, `scripts/`, `tests/`, `docs/` and root
      scripts.
    - GitHub Actions workflows are linted with
      `actionlint` pinned at v1.7.7 via pre-commit.
    - `make test` expects dependencies from `.codex/setup.sh`.
    - Performance tests reside in `tests/performance` and run as part of
      `make test`. Execute them alone with `pytest tests/performance`.
3. **Style rules** – keep code formatted (`black`, `prettier`,
   `dart format`, etc.) and Markdown lines ≤ 80 chars;
   avoid multiple consecutive blank lines (markdownlint MD012);
   exactly **one blank line** separates log entries.
4. **Exit‑code conventions** – scripts must exit ≠ 0 on failure so
   CI catches regressions
   (e.g. fail fast when quality gates or metric thresholds aren’t met).
5. **Version‑pin policy** – pin *major*/*minor* versions for critical runtimes &
   actions (e.g. `actions/checkout@v4`, `node@20`, `python@3.11` and `python@3.12`).
6. **Confirm pinned packages exist** – verify each version listed in
   `requirements.txt`, `package.json` or other manifests is available on
   its package registry before committing.
7. **When docs change, update them everywhere** – if ambiguity arises,
   `/docs` overrides this file.
8. **Log discipline** – when a TODO item is ticked you **must** add the matching
   section in `NOTES.md` *in the same PR*; this keeps roadmap and log in‑sync.
9. **Dependabot** – weekly checks update pinned versions in
   `requirements.txt`, `package.json` and the CI workflow.

---

## 4 · Lean but “fail-fast” CI skeleton

`.github/workflows/ci.yml` — copy → adjust tool commands as needed.

<!-- markdownlint-disable MD013 -->
```yaml
name: CI
on:
  pull_request:
  push:
jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      md_only: ${{ steps.filter.outputs.md_only }}
    steps:
      - uses: actions/checkout@v4
      - id: filter
        uses: dorny/paths-filter@v3
        with:
          filters: |
            md_only:
              - '**/*.md'

  # --- helper step: detect secrets without using them in `if:` ---
  secret-check:
    runs-on: ubuntu-latest
    outputs:
      has_pages_token: ${{ steps.echo.outputs.has_pages }}
    steps:
      - id: echo         # returns 'true' / 'false'
        run: echo "has_pages=${{ secrets.GH_PAGES_TOKEN != '' }}" >> "$GITHUB_OUTPUT"

  lint-docs:
    needs: [changes]
    if: needs.changes.outputs.md_only == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          npx --yes markdownlint-cli '**/*.md'
          grep -R --line-number -E '<{7}|={7}|>{7}' --exclude=ci.yml \
            --exclude-dir=node_modules --exclude-dir=.pre-commit-cache \
            --exclude-dir=frontend/dist --exclude-dir=docs/_build . && exit 1 \
            || echo "No conflict markers"

  markdown-link-check:
    needs: [changes]
    if: needs.changes.outputs.md_only == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lycheeverse/lychee-action@v2.4.1
        with:
          args: --no-progress --verbose '**/*.md'

  actionlint:
    needs: [changes]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: rhysd/actionlint@v1.7.7

  test:
    needs: [changes]
    if: needs.changes.outputs.md_only != 'true'
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python: ['3.11', '3.12']
        node: ['20']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python }}
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - name: Bootstrap
        run: PYTHON_VERSION=${{ matrix.python }} NODE_VERSION=${{ matrix.node }} ./.codex/setup.sh
      - run: make lint
      - run: make typecheck
      - run: make typecheck-ts
      - run: make test

  test-win:
    needs: [changes]
    if: needs.changes.outputs.md_only != 'true'
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - name: Bootstrap
        run: ./scripts/setup.ps1
        shell: pwsh
        env:
          SKIP_PRECOMMIT: '1'
      - run: scripts\lint.ps1
        shell: pwsh
      - run: python pymake.py lint
        shell: pwsh
      - run: scripts\typecheck.ps1
        shell: pwsh
      - run: scripts\typecheck-ts.ps1
        shell: pwsh
      - run: scripts\test.ps1
        shell: pwsh
```
<!-- markdownlint-enable MD013 -->

- **Docs‑only changes** run in seconds (`lint-docs` + `markdown-link-check`).
- Use `<!-- lychee skip -->` after local URLs (e.g. `http://localhost:`)
  so lychee doesn’t fail. Localhost patterns are also
  ignored via `.lycheeignore`.
- **Code changes** run full lint + tests (`test` & `test-win`) and `actionlint`.
- Add job matrices or deployments later—guardrails above already catch the 90 %
  most common issues.

---

## 5 · Coding & documentation style

- 4‑space indent (or 2‑spaces for JS/TS when enforced by the linter).
- ≤ 20 logical LOC per function, ≤ 2 nesting levels.
- Surround headings / lists / fenced code with a blank line
  (markdownlint MD022, MD032).
- Surround fenced code blocks with a blank line (markdownlint MD031).
- **No trailing spaces.** `python scripts/repo_checks.py` enforces this via
  pre-commit and `make lint`.
- Wrap identifiers like `__init__` in back‑ticks to avoid MD050.
- Each public API carries a short doc‑comment.
- Keep Markdown lines ≤ 80 chars to improve diff readability
   (tables may exceed if unavoidable).
- Use `-` for bullet lists.
- Indent nested bullet lists by two spaces relative to their parent item.
- Use a normal space after `#` in headings.
- Avoid bare URLs; format them as Markdown links (MD034).
- Avoid inline HTML.
- All Python modules, including tests, must start with
  `from __future__ import annotations` so union types work on Python 3.9.
- Use the same clock source for all duration measurements; in browsers call
  `performance.now()`.

---

## 6 · How to update these rules

- Edit **only what you need**, append a dated bullet in `NOTES.md`,
  **bump the version number** at the top of this file, and open a PR.
- When CI tooling changes (new Action versions, new secrets,
   extra language runners)
   **update both** this guide **and** the workflow file in the **same PR**.

Happy shipping 🚀
