# Branching and Baseline Strategy

A baseline is a recorded set of accepted pre-existing findings, so a pull request fails only on findings it introduces. This table covers the tools that run on pull requests. "PR gate" means the tool can block a merge into `staging`, according to the `staging` branch rulesets. The other protected branches (`develop`, `irs`, `test`, `prod`) require no security checks.

## Per-tool baseline status

"In repo" means the baseline or suppression lives in a file that is committed and reviewed with the code. "Documented" means [scanner-reference.md](remediation/scanner-reference.md) or the tool's own page in this folder explains how to add to it.

| Tool | Workflow | PR gate | Baseline method in the repo | Documented way to add or refresh | What's missing |
|------|----------|---------|-----------------------------|----------------------------------|----------------|
| Semgrep | `security-sast.yml` | Yes. `Security Gate (SAST)` is required on `staging`. | Yes, derived from git: `--baseline-commit` against the merge base. No file to maintain. | Yes. `// nosemgrep: <rule-id>` | Nothing. |
| Checkov | `security-sast.yml` | Partly. `Security Gate (SAST)` fails only for four hard-fail checks; the rest are `--soft-fail`. | Yes, nine `.checkov.baseline` files. Only `allColors` and `account-specific` have entries. | Partly. Docs say to add an accepted finding to the baseline, with `#checkov:skip` preferred for new ones, but not how to regenerate the file. | The command and steps to regenerate a baseline. |
| CodeQL | `security-sast.yml` | Yes. The code-scanning rule on `staging` blocks new high-or-higher alerts, and `Security Gate (SAST)` requires the job to complete. | No file. Baseline is alert state on staging, compared by the `staging` ruleset's code-scanning rule. | Yes. Security tab dismissal with a required comment format. | Nothing in the repo. The baseline depends on staging uploads continuing. |
| ShellCheck | `security-sast.yml` | Yes. `Security Gate (SAST)` is required on `staging`. | No. `.shellcheckignore` exists but is empty, and the job fails on any finding. | No. Not covered in the suppression table. | A baseline method, and the documentation for it. |
| Gitleaks | `security-secrets.yml` | Yes. `Security Gate (Secrets)` is required on `staging`. | Yes. `.gitleaksignore` (6 entries) and `.gitleaks.toml`. The PR scan is limited to the PR's own commits. | Yes. Fingerprint in `.gitleaksignore`, or an `allowlist` entry. | Nothing. |
| Dependency Review | `security-supply-chain.yml` | No. `warn-only: true`, and not a required check. | Yes, derived from the dependency graph: it compares base and head manifests. `allow-ghsas` is empty. | Yes. `allow-ghsas` | Nothing. |
| npm audit | `security-supply-chain.yml` | No. `continue-on-error`, and not a required check. | No. It reports every advisory on every run. | No. Docs say "None. Patch or accept." | A baseline method (an allowlist of accepted advisories), and the documentation for it. |
| lockfile-lint | `security-supply-chain.yml` | No. `continue-on-error`, and not a required check. | No. | No. | A baseline method, and the documentation for it. |
| Trivy (`fs`) | `security-supply-chain.yml` | No. `continue-on-error`, and not a required check. | No. There is no `.trivyignore`. | Partly. Security tab dismissal only. | An in-repo baseline method (`.trivyignore` or equivalent), and its documentation. |
| Trivy (`fs`) | `security-compare.yml` | No. The job fails if the branch has more findings than staging, but it is not a required check. | Partly. Staging is scanned in the same job on every run, so it needs no refresh. It compares counts, not findings. | n/a, since staging is rescanned each run. | Comparison by finding identity (CVE plus package) instead of count. |
| Trivy (`config`) | `security-containers.yml` | No. Not a required check, and the containers gate is not required either. | No. | Partly. Security tab dismissal only. | An in-repo baseline method, and its documentation. |
| Trivy (`image`, core image) | `security-containers.yml` | No. Scans run with `exit-code: '0'`. | No. `container-findings-triage.md` describes a VEX file at `.vex/ef-cms.openvex.json`, but that file is not in the repo. | Partly. The VEX update steps are documented, and Security tab dismissal is documented. | The VEX file itself, or another in-repo method. |
| Trivy (`image`, runtime base images) | `security-containers.yml` | No. Scans run with `exit-code: '0'`. | No. Same as the core image. | Same as the core image. | Same as the core image. |
| ZAP API Scan | `security-dast.yml` | No. `continue-on-error`, and not a required check. | Partly. `.zap/rules.tsv` sets handling per rule (three `WARN` lines, no `IGNORE`), not per alert. | Yes. `IGNORE` line in `.zap/rules.tsv` | Per-alert baselining (rule ID plus URL), and a comparison against staging. |
| ZAP Public API Baseline Scan | `security-dast.yml` | No. `continue-on-error`, and not a required check. | Partly. Same `.zap/rules.tsv`. | Yes. Same file. | Same as the ZAP API Scan, plus the SARIF converter (#10412) so results reach the Security tab. |

## Constraints
- New alerts outside of baseline are required to be fixed in the same PR where detected. If for any reason it can't be fixed, either due to size of change required or the fix is simplify not availble (i.e. the offending package hasn't put out a fix yet), a minimum of a ticket needs to be logged for it. (If it involves a Trivy image or Trivy fs result, a VEX statement is required, regardless of whether or not it could be fixed in branch our not.)
- Unless otherwise authorized by Tech Lead, if your code breaks it, you are expected to fix it.

## Semgrep
Static analysis tool, here's what an alert for it can look like:
`web-client/integration-tests/journey/irsSuperuserGetsReconciliationReport.ts:16`

```js
const userToken = jwt.sign(user, 'secret');
```
**Semgrep Finding: javascript.jsonwebtoken.security.jwt-hardcode.hardcoded-jwt-secret**

 hard-coded credential was detected. It is not recommended to store credentials in source-code, as this risks secrets being leaked and used by either an internal or external malicious adversary. It is recommended to use environment variables to securely provide credentials or retrieve credentials from a secure vault or HSM (Hardware Security Module).

## Decisions that apply to every scan

1. **Where the baseline lives.** Committed files are reviewable and versioned with the code. Security tab alert state is easier to maintain but invisible to PR diffs.
2. **Baseline branch.** Staging is the de facto baseline. `develop`, `irs`, `test` and `prod` have no security gates.
3. **Identity of a finding.** Each tool needs a stable key: rule ID plus location, CVE plus package, or a fingerprint. Count-based comparison does not work as a baseline.
4. **Ownership and expiry.** Every accepted finding needs a reason, an owner and a review date.
5. **Refresh trigger.** New CVEs appear without code changes. The weekly schedule finds them, and someone has to decide whether each one is fixed or accepted.
