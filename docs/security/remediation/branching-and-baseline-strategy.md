# Branching and Baseline Strategy

A baseline is a recorded set of accepted pre-existing findings, so a pull request fails only on findings it introduces. This table covers the tools that run on pull requests. "PR gate (staging)" means the tool can block a merge into `staging`, according to the `staging` branch rulesets. "Gated on test" means the same for `test`. The `test` ruleset requires only approvals, so no tool gates there. `develop`, `irs` and `prod` also require no security checks.

## Per-tool baseline status

"In repo" means the baseline or suppression lives in a file that is committed and reviewed with the code. "Documented" means [scanner-reference.md](remediation/scanner-reference.md) or the tool's own page in this folder explains how to add to it.

| Tool | Workflow | PR gate (staging) | Gated on test | Baseline method in the repo | Documented way to add or refresh | What's missing |
|------|----------|---------|---------------|-----------------------------|----------------------------------|----------------|
| Semgrep | `security-sast.yml` | Yes. `Security Gate (SAST)` is required on `staging`. | No. `test` requires no security checks. | Yes, derived from git: `--baseline-commit` against the merge base. No file to maintain. | Yes. `// nosemgrep: <rule-id>` | Nothing. |
| Checkov | `security-sast.yml` | Partly. `Security Gate (SAST)` fails only for four hard-fail checks; the rest are `--soft-fail`. | No. `test` requires no security checks. | Yes, nine `.checkov.baseline` files. Only `allColors` and `account-specific` have entries. | Partly. Docs say to add an accepted finding to the baseline, with `#checkov:skip` preferred for new ones, but not how to regenerate the file. | The command and steps to regenerate a baseline. |
| CodeQL | `security-sast.yml` | Yes. The code-scanning rule on `staging` blocks new high-or-higher alerts, and `Security Gate (SAST)` requires the job to complete. | No. `test` requires no security checks. | No file. Baseline is alert state on staging, compared by the `staging` ruleset's code-scanning rule. | Yes. Security tab dismissal with a required comment format. | Nothing in the repo. The baseline depends on staging uploads continuing. |
| ShellCheck | `security-sast.yml` | Yes. `Security Gate (SAST)` is required on `staging`. | No. `test` requires no security checks. | No. `.shellcheckignore` holds one line (`node_modules/`), but nothing reads it: ShellCheck has no ignore file, and `run-shellcheck.sh` excludes paths in its own `find` command. The job fails on any error-level finding. | No. Not covered in the suppression table. | A baseline method, and the documentation for it. |
| Gitleaks | `security-secrets.yml` | Yes. `Security Gate (Secrets)` is required on `staging`. | No. `test` requires no security checks. | Yes. `.gitleaksignore` (6 entries) and `.gitleaks.toml`. The PR scan is limited to the PR's own commits. | Yes. Fingerprint in `.gitleaksignore`, or an `allowlist` entry. | Nothing. |
| Dependency Review | `security-supply-chain.yml` | No. `warn-only: true`, and not a required check. | No. `test` requires no security checks. | Yes, derived from the dependency graph: it compares base and head manifests. `allow-ghsas` is empty. | Yes. `allow-ghsas` | Nothing. |
| npm audit | `security-supply-chain.yml` | No. `continue-on-error`, and not a required check. | No. `test` requires no security checks. | No. It reports every advisory on every run. | No. Docs say "None. Patch or accept." | A baseline method (an allowlist of accepted advisories), and the documentation for it. |
| lockfile-lint | `security-supply-chain.yml` | No. `continue-on-error`, and not a required check. | No. `test` requires no security checks. | No. | No. | A baseline method, and the documentation for it. |
| Trivy (`fs`) | `security-supply-chain.yml` | No. `continue-on-error`, and not a required check. | No. `test` requires no security checks. | No. There is no `.trivyignore`. | Partly. Security tab dismissal only. | An in-repo baseline method (`.trivyignore` or equivalent), and its documentation. |
| Trivy (`fs`) | `security-compare.yml` | No. The job fails if the branch has a finding that `staging` doesn't, but it is not a required check. | No. `test` requires no security checks. | Yes, derived from a scan of `staging` in the same job on every run, so it needs no refresh. Findings are compared by identity (`ruleId`, package and file), not by count. | n/a, since staging is rescanned each run. | It isn't a required check. Also, the summary has no cap on the number of findings it lists. |
| Trivy (`config`) | `security-containers.yml` | No. Not a required check, and the containers gate is not required either. | No. `test` requires no security checks. | No. | Partly. Security tab dismissal only. | An in-repo baseline method, and its documentation. |
| Trivy (`image`, core image) | `security-containers.yml` | No. Scans run with `exit-code: '0'`. | No. `test` requires no security checks. | No. `container-findings-triage.md` describes a VEX file at `.vex/ef-cms.openvex.json`, but that file is not in the repo. | Partly. The VEX update steps are documented, and Security tab dismissal is documented. | The VEX file itself, or another in-repo method. |
| Trivy (`image`, runtime base images) | `security-containers.yml` | No. Scans run with `exit-code: '0'`. | No. `test` requires no security checks. | No. Same as the core image. | Same as the core image. | Same as the core image. |
| ZAP API Scan | `security-dast.yml` | No. `continue-on-error`, and not a required check. | No. `test` requires no security checks. | Partly. `.zap/rules.tsv` sets handling per rule (three `WARN` lines, no `IGNORE`), not per alert. | Yes. `IGNORE` line in `.zap/rules.tsv` | Per-alert baselining (rule ID plus URL), and a comparison against staging. |
| ZAP Public API Baseline Scan | `security-dast.yml` | No. `continue-on-error`, and not a required check. | No. `test` requires no security checks. | Partly. Same `.zap/rules.tsv`. | Yes. Same file. | Same as the ZAP API Scan, plus the SARIF converter (#10412) so results reach the Security tab. |

**NOTE:** Recommend having `Test` mirror the scan gates same as `Staging`.

## Baseline and comparison behavior

**The baseline branch is `staging`.** Findings that exist on `staging` are accepted pre-existing debt. A pull request is judged only on findings it adds. Production is built from `staging`, so nothing reaches production that `staging` has not already accepted.

`test` is a dry run of the `staging` PR: it is `staging` plus the developer's branch. Its baseline is therefore `staging`'s baseline, not a second one. Developers sync their branch with `staging` before opening a PR into `test`. Scan results from `test` are not uploaded to the Security tab, so `test` has no alert state of its own. It can only catch new findings, by comparing against `staging`.

### What counts as a new finding

| Tool | A finding is new when | Compared against, PR into `staging` | Compared against, PR into `test` today | Needed for `test` to match `staging` |
|------|-----------------------|-------------------------------------|----------------------------------------|--------------------------------------|
| Semgrep | It is on a line the PR changed since the merge base. | `staging`'s tip. | `test`'s tip, so it ignores what `test` already carries from other branches. | Change `BASE_REF` in the Semgrep step to `staging`. |
| Checkov | It is not in the directory's `.checkov.baseline`. Only the four hard-fail checks block. | The baseline file on the PR's branch. | Same. | Nothing. |
| CodeQL | The alert is not already open on `staging`. The `staging` code-scanning rule blocks new high-or-higher alerts. | Alert state on `staging`. | Nothing. The job only has to complete. | A decision: leave ungated, or add a step that diffs the local SARIF against `staging`'s alerts. |
| ShellCheck | Any error-level finding. There is no baseline. | n/a | n/a | Nothing. |
| Gitleaks | It is in a commit that belongs to the PR and is not in `.gitleaksignore` or `.gitleaks.toml`. | The PR's own commits. | Same. The commit range on `test` PRs is not verified. | Verify the range. |
| Dependency Review | A manifest change adds a vulnerable dependency. Warn-only. | The base branch's manifests. | `test`'s manifests. | Nothing for now, since it does not block. |
| Trivy `fs` (`Findings vs staging`) | The rule, package and file combination is not in a Trivy scan of `staging` made in the same job. HIGH, CRITICAL and UNKNOWN, vulnerabilities only. | `staging`, scanned on every run. | Same. | Nothing. |

Trivy `config`, Trivy `image`, npm audit, lockfile-lint and ZAP have no comparison. They report everything on every run.

### Where the `test` comparison is not exact

- The Trivy compare scans the PR as a merge into its base branch. On a `test` PR that includes commits other developers have merged to `test` but not yet to `staging`. A finding introduced by someone else's branch can show up as new on yours. This is rare while `test` carries one branch at a time and grows with the number of unpromoted branches.
- Semgrep has the same effect in the other direction: it baselines against `test`, so a finding another branch already put on `test` is treated as accepted.
- `Findings vs staging` and Dependency Review run on PRs into `test`, but neither is a required check anywhere, so neither blocks a merge.

### Required for `test` to catch new findings

The `test` ruleset requires only approvals today. To block PRs on new findings without uploading anything:

1. Require `Security Gate (SAST)` and `Security Gate (Secrets)` on `test`, as on `staging`.
2. Point Semgrep's baseline at `staging` instead of the PR's base branch.
3. Decide how CodeQL behaves on `test`, as described above.
4. Resolve the docs-only case. These workflows skip docs-only PRs with `paths-ignore`, and a required check that is skipped stays pending, so a docs-only PR cannot merge. Remove `paths-ignore` from the two gate workflows, or add a gate that always reports a status.

None of these changes have been made. Each is a ruleset or workflow edit for a follow-up ticket.

## Constraints
- New alerts outside of baseline are required to be fixed in the same PR where detected. If for any reason it can't be fixed, either due to size of change required or the fix is simplify not availble (i.e. the offending package hasn't put out a fix yet), a minimum of a ticket needs to be logged for it. (If it involves a Trivy image or Trivy fs result, a VEX statement is required, regardless of whether or not it could be fixed in branch our not.)
- Unless otherwise authorized by Tech Lead, if your code breaks it, you are expected to fix it.
- Baseline branch is `Staging`.


## When Devs are expected to fix alerts caused by their changes

**Fix it in the PR that caused it.** A finding that appears in your PR because of your change is cheapest to fix now, while the code is fresh and before it reaches `test` or `staging`. Don't wait for the weekly triage, and don't merge on the assumption that someone else will pick it up. The [playbook](playbook.md#missing-an-sla) holds new code to a stricter standard than existing findings: it must not add medium- or high-severity findings at all.

Findings already in the baseline are not your responsibility, and they don't block your PR. They are worked through the SLAs in the [playbook](playbook.md#remediation-slas).

### When a fix can be deferred to a ticket

Defer only when one of these is true:
- The fix is too large for this PR AND **is not** in scope for your branch's changes.
- No fix exists yet, for example the package has no patched release.

If so:
1. Log a ticket before you merge, using the title format in [Ownership](playbook.md#ownership).
2. Get the approver's (tech lead or delegate) sign-off on the PR. Every deferral, suppression and risk acceptance needs it, at every severity ([Suppressing a finding](playbook.md#suppressing-a-finding)).
3. Record the decision in the ticket using the [exception record](playbook.md#the-exception-record). For a Trivy `fs` or `image` finding, publish a [VEX statement](playbook.md#vex-statements) too, whether or not the fix lands in your branch.
4. If there is no upstream fix, work through [No upstream fix](playbook.md#no-upstream-fix) first. "No patch" alone isn't a reason to accept a finding.

To suppress a finding in a scanner, see [Suppression mechanisms](scanner-reference.md#suppression-mechanisms). Unless the tech lead has authorized it, if your change breaks it, you fix it.

**Never deferred:** a real secret. Rotate it the same business day and follow [Secrets](playbook.md#secrets).

### Semgrep and CodeQL
**Compares against:** `staging`. Semgrep reports only findings in code your PR changed. CodeQL compares alerts with those open on `staging`.

- **Semgrep blocks your PR** (`Security Gate (SAST)`). Fix the flagged code. See [If your PR is blocked by Semgrep](../sast-scanning.md#if-your-pr-is-blocked-by-semgrep).
- **CodeQL blocks a PR into `staging`** for new high-or-higher alerts. Fix the alert, or have the approver agree to a dismissal in the Security tab with a tracking record.
- **PRs into `test`:** Results aren't uploaded, so read the job log and fix what it reports. Don't leave it for the `staging` PR.

### npm audit and Trivy fs
**Compares against:** nothing, except Dependency Review (changed dependencies, high and above) and `Findings vs staging` (new Trivy fs findings not on `staging`, matched by CVE, package and file).

These don't block your PR, so a green check doesn't mean you added nothing. If your PR changes `package.json` or the lockfile, check the Dependency Review and `Findings vs staging` summaries, and take the fix by updating the dependency ([Patching npm dependencies](playbook.md#patching-npm-dependencies)). If you can't, defer with a ticket and a VEX statement as above.

### Gitleaks
**Compares against:** the commits in your PR only.

A real secret is never deferred: rotate it and clean it up ([Secrets](playbook.md#secrets)). A false positive goes in `.gitleaksignore` in a separate PR with the approver's sign-off ([Secrets scanning](../secrets-scanning.md#2-pr-ci-gate-blocking)).

### Checkov (Terraform)
**Compares against:** the directory's `.checkov.baseline`.

Only the four hard-fail checks block your PR. Fix the resource for all of them. For other Checkov findings your change adds, fix them too. If one can't be fixed, prefer an inline `#checkov:skip=<CHECK_ID>:<reason>` over adding to a baseline file, and get the approver's sign-off.

### ShellCheck
**Compares against:** nothing. Any error-level finding blocks the PR.

Fix the error in the PR. Don't add paths to `.shellcheckignore`: nothing reads it, and ShellCheck has no ignore file. Excluding a path means editing the `find` command in `run-shellcheck.sh`. A single false positive can be suppressed inline with `# shellcheck disable=SC<number>` above the line, with the approver's sign-off and a one-line reason. That form isn't in the suppression table in `scanner-reference.md` yet.
