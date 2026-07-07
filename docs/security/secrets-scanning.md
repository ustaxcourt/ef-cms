# Secrets Scanning

DAWSON uses [Gitleaks](https://github.com/gitleaks/gitleaks) to prevent credentials and tokens from
being committed to this repository. There are three layers of defense:

## 1. Pre-commit hook (local)

The Husky pre-commit hook runs `gitleaks protect --staged` before every commit, scanning only the
files you've staged. It takes under a second.

**Install Gitleaks once:**

```sh
brew install gitleaks        # macOS
# or: https://github.com/gitleaks/gitleaks/releases
```

If `gitleaks` is not installed, the hook skips with a warning — CI is the real gate. You won't be
blocked from committing locally, but **your PR will be blocked** if a secret is detected.

## 2. PR CI gate (blocking)

`.github/workflows/security-secrets.yml` runs on every non-draft pull request. It scans only the
commits your PR introduces (`base..head`), so pre-existing issues in the tree don't block your PR.

If your PR is blocked:

- **Check the Security tab** → Code scanning alerts → category `gitleaks` for the finding.
- **If it's a real secret**: rotate it immediately, remove it from your branch, force-push.
- **If it's a false positive**: add the finding's fingerprint to `.gitleaksignore` in a separate PR
  with a one-line justification (mirrors the `allow-ghsas` pattern in `security-supply-chain.yml`).

To generate a fingerprint from a failed run:
```sh
gitleaks detect --config .gitleaks.toml --report-format json --report-path /tmp/report.json
cat /tmp/report.json | jq '.[].Fingerprint'
```

## 3. GitHub native push protection

For public repos, GitHub's built-in push protection blocks pushes containing recognized secret
patterns *before* they reach the server (with provider validity checks Gitleaks can't do).

Enable: **Settings → Code security → Secret scanning → Push protection** (requires org admin).

## Allowlist / config

`.gitleaks.toml` is the shared config used by both the pre-commit hook and CI. It:
- Inherits Gitleaks' full built-in ruleset.
- Excludes `node_modules`, build artifacts, `.terraform`, `cypress/`, and `*example.env` files.
- Allowlists known dev fallbacks in `web-api/src/environment.ts` that are **not deployed** secrets.

## Deferred: full history scan

This repo has 75k commits of public history. Any credential that was ever committed is already
public and must be **rotated** — see `scripts/user/rotate-environment-secrets.ts` and
`scripts/secrets/*`. The full-history scan is tracked as a separate task.

## Known hygiene issues (to fix separately)

These were found during the initial scan setup and should be fixed in dedicated PRs:

- `scripts/secrets/update-secret.ts:62` — logs the actual secret value to stdout.
- `web-api/terraform/bin/deploy-app-color.sh:38` and `destroy-app-color.sh:38` — `echo`s
  `DEFAULT_ACCOUNT_PASS` value to stdout.
