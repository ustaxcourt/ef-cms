# SAST Scanning

DAWSON uses four static analysis tools, all wired through `.github/workflows/security-sast.yml`.

## Tools

| Job | Tool | What it checks | Blocking? |
|-----|------|----------------|-----------|
| `semgrep` | [Semgrep](https://semgrep.dev/) 1.167.0 | TypeScript/JS taint analysis (SSRF, command injection, path traversal, XSS, SQLi) | Yes (PR gate) |
| `checkov` | [Checkov](https://www.checkov.io/) 3.3.2 | Terraform IaC misconfigurations | Yes (hard-fail on critical checks) |
| `codeql` | [CodeQL](https://codeql.github.com/) | Deep semantic analysis | Analysis must complete; findings are blocked by GitHub code-scanning rules |
| `shellcheck` | [ShellCheck](https://www.shellcheck.net/) 0.10.0 | Shell script bugs and security issues | Yes (PR gate) |

## Trigger

- **PRs** (non-draft, targeting staging): runs `semgrep`, `checkov`, `codeql`, `shellcheck`, and the `security-gate` job
- **Push to staging**: runs `semgrep`, `checkov`, and `codeql`; Semgrep and Checkov populate the default-branch baseline

## Semgrep

Runs diff-scoped analysis (`--baseline-commit`) so only **new** findings in the PR are flagged.
On pushes to `staging`, it scans the full tree to establish the default-branch baseline.

### Rule packs

Standard community packs: `p/typescript`, `p/nodejs`, `p/react`, `p/jwt`, `p/sql-injection`, `p/xss`, `p/command-injection`, `p/expressjs`.

### Custom rules (`.semgrep/dawson-rules.yml`)

DAWSON-specific taint rules covering both Express (`$REQ.*`) and API Gateway Lambda (`$EVENT.*`) input sources:

| Rule | CWE | Sinks |
|------|-----|-------|
| `dawson-ssrf-user-input-to-request` | CWE-918 | axios, fetch, got, http.get/request |
| `dawson-command-injection-user-input` | CWE-78 | child_process exec/spawn |
| `dawson-path-traversal-user-input` | CWE-22 | fs read/write, path.join/resolve |
| `dawson-unsafe-json-parse-user-input` | CWE-915 (WARNING) | JSON.parse |

### If your PR is blocked by Semgrep

1. Check the **Security tab** > Code scanning alerts > category `semgrep` for details.
2. Fix the taint flow (validate/sanitize input before it reaches the sink).
3. If it's a false positive: add an inline `// nosemgrep: rule-id` comment with a one-line justification.

## Checkov (IaC)

Scans each Terraform applyable directory individually against its own `.checkov.baseline` file, so only **net-new** findings block.

### Scanned directories

```
web-api/terraform/applyables/account-specific
web-api/terraform/applyables/allColors
web-api/terraform/applyables/blue
web-api/terraform/applyables/green
web-api/terraform/applyables/reindex-cron
web-api/terraform/applyables/stale-cases-email-cron
web-api/terraform/applyables/switch-colors-cron
web-api/terraform/applyables/terraform-state-backend
web-api/terraform/applyables/wait-for-workflow
```

### Skipped checks (pre-existing tech debt)

`CKV_AWS_117`, `CKV_AWS_115`, `CKV_AWS_116`, `CKV_AWS_272`, `CKV2_AWS_62`, `CKV2_AWS_61`, `CKV_AWS_144`, `CKV_AWS_338`, `CKV_AWS_66`, `CKV_TF_3`, `CKV_TF_1`

### Hard-fail checks (always blocking)

`CKV_AWS_57` (public S3), `CKV_AWS_20` (public S3), `CKV_AWS_23` (unencrypted security group), `CKV_AWS_7` (unencrypted KMS)

### If your PR is blocked by Checkov

1. Check the Actions log for which check failed and in which directory.
2. Fix the Terraform resource, or if it's an accepted risk, add the finding to the directory's `.checkov.baseline`.

## CodeQL

Runs on non-draft PRs and staging pushes. Uses `security-extended` + `security-and-quality` query suites with a custom config (`.github/codeql/codeql-config.yml`) that excludes test files, node_modules, and non-production scripts.

Findings appear in the **Security tab** under category `/language:javascript-typescript`.

The CodeQL action uploads findings but does not fail solely because it found an alert. To block merges based on CodeQL findings, configure a GitHub ruleset for `staging` with **Require code scanning results**, select CodeQL, and set the minimum alert severity that must be resolved before merging.

## ShellCheck

Runs `./run-shellcheck.sh` which finds all project `.sh` files (excluding generated Husky files, node_modules, .terraform, dist, and coverage) and runs ShellCheck with `-S error` severity. Only error-level findings fail the build.

## Security Gate

The `security-gate` job aggregates results from `semgrep`, `checkov`, `codeql`, and `shellcheck`. If any scan fails or CodeQL does not complete successfully, the gate fails. This is the single workflow check to require in branch protection rules; use the GitHub code-scanning ruleset separately to block CodeQL alerts.
