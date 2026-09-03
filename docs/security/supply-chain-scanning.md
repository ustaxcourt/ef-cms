# Supply Chain Scanning

DAWSON uses multiple tools to detect vulnerable or compromised dependencies. All scanning is in `.github/workflows/security-supply-chain.yml`.

## Jobs

| Job | Tool | What it checks | Blocking? |
|-----|------|----------------|-----------|
| `dependency-review` | [dependency-review-action](https://github.com/actions/dependency-review-action) v5 | New dependencies introduced in a PR against GitHub Advisory DB | No (warn-only) |
| `lockfile-lint` | [lockfile-lint](https://github.com/lirantal/lockfile-lint) 5.0.0 | Lockfile integrity (HTTPS registries, valid checksums) | No (warn-only) |
| `npm-audit` | `npm audit` | Known vulnerabilities in production deps (`--omit=dev`) | No (warn-only) |
| `trivy` | [Trivy](https://trivy.dev/) filesystem scan | Full-tree vuln scan (OS + library) | No (warn-only) |

## Trigger

All jobs run on non-draft PRs targeting staging. No push-to-staging job (container and SAST baselines cover that).

## Dependency Review

Uses GitHub's native dependency graph diff to flag newly added dependencies with HIGH+ severity advisories. Currently `warn-only: true`.

To make blocking: set `warn-only: false` and configure `allow-ghsas` with any accepted advisories (same pattern as `.gitleaksignore` for secrets).

## Lockfile Lint

Validates `package-lock.json`:
- All packages resolve to HTTPS URLs (no HTTP, no git://)
- Integrity hashes are present (detect tampered packages)

Currently `continue-on-error: true` (non-blocking).

## npm audit

Runs `npm audit --audit-level=high --omit=dev` — only production dependencies, only HIGH+ severity.

### Known open findings (as of initial setup)

| Package | Severity | Advisory | Root cause |
|---------|----------|----------|-----------|
| `shell-quote@1.8.3` | CRITICAL | GHSA-w7jw-789q-3m8p | via `npm-run-all` |
| `form-data@4.0.5` | HIGH | GHSA-hmw2-7cc7-3qxx | via `axios` |

Fix path: `npm audit fix` (or `--force` for breaking changes). Remove `continue-on-error` once resolved or risk-accepted.

## Trivy filesystem scan

Scans the full source tree for vulnerable dependencies (reads `package-lock.json`, `go.sum`, etc. directly). Severity: HIGH + CRITICAL. Results upload to the Security tab under category `trivy`.

Uses `continue-on-error: true` — findings are informational until triaged.

## Making a scan blocking

1. Resolve or document all existing findings
2. Remove `continue-on-error: true` from the step (or set `warn-only: false` for dependency-review)
3. Add a gate job (like `security-gate` in SAST) if you want a single required check
