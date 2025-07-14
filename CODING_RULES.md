# Coding‑Guard
1  One source file ⇢ one domain concept
2  External imports ≤3 and never cyclic
3  DRY: extract any ≥3‑line repetition into a helper
4  Each function ≤20 LOC and ≤2 nesting levels
5  Use clear, intention‑revealing names
6  Validate all inputs first; fail fast on invalid data
7  Follow the project’s single error‑handling pattern
8  No hidden side‑effects; keep variables at narrowest scope
9  Prefer composition over inheritance
10 Secrets must not appear; secret‑scan must pass
11 Dependency tree must contain 0 critical/high‑CVEs
12 Run auto‑formatter, linter, and SAST before output
13 Unit‑test template with ≥1 positive and ≥1 negative case per public API
14 Achieve ≥90 % branch coverage and cyclomatic complexity ≤15 per file
15 Emit lightweight performance/log hooks for three actionable metrics
16 Full static type annotations; type checker passes with 0 errors
17 Use context‑managed resource handling; 0 leak warnings in SAST
18 Docstring for every public API (purpose, params, returns, raises)
19 Guard shared state; prefer single‑thread or thread‑safe primitives
20 Parameterize all SQL/shell/HTML; never interpolate user input
21 SCA must show 0 license conflicts or missing NOTICE files
22 Load runtime config from env/secrets‑manager only
23 Structured, redacted logs; log level & sink configurable
24 Use defensive coding
25 Follow SOLID principles
26 follow Confidentiality, Integrity, Availability
27 follow defense in depth
28 reduce attack surfaces
