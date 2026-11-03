# Branching and Baseline Strategy

A baseline is a recorded set of accepted pre-existing findings, so a pull request fails only on findings it introduces. This table covers the tools that run on pull requests. "PR gate (staging)" means the tool can block a merge into `staging`, according to the `staging` branch rulesets. "Gated on test" means the same for `test`. No security check is required on `test`, `develop`, `irs` or `prod`; see [Branch rules today](#branch-rules-today).

## Per-tool baseline status

"In repo" means the baseline or suppression lives in a file that is committed and reviewed with the code. "Documented" means [scanner-reference.md](scanner-reference.md) or the tool's own page in this folder explains how to add to it.

| Tool | Workflow | PR gate (staging) | Gated on test | Baseline method in the repo | Documented way to add or refresh | What's missing |
|------|----------|---------|---------------|-----------------------------|----------------------------------|----------------|
| Semgrep | `security-sast.yml` | Yes. `Security Gate (SAST)` is required on `staging`. | No. | Yes, derived from git: `--baseline-commit` against the merge base. No file to maintain. | Yes. `// nosemgrep: <rule-id>` | Nothing. |
| Checkov | `security-sast.yml` | Partly. `Security Gate (SAST)` fails only for four hard-fail checks; the rest are `--soft-fail`. | No. | Yes, nine `.checkov.baseline` files. Only `allColors` and `account-specific` have entries. | Partly. Docs say to add an accepted finding to the baseline, with `#checkov:skip` preferred for new ones, but not how to regenerate the file. | The command and steps to regenerate a baseline. |
| CodeQL | `security-sast.yml` | Yes. The code-scanning rule on `staging` blocks new high-or-higher alerts, and `Security Gate (SAST)` requires the job to complete. | No. | No file. Baseline is alert state on staging, compared by the `staging` ruleset's code-scanning rule. | Yes. Security tab dismissal with a required comment format. | Nothing in the repo. The baseline depends on staging uploads continuing. |
| ShellCheck | `security-sast.yml` | Yes. `Security Gate (SAST)` is required on `staging`. | No. | No. `.shellcheckignore` holds one line (`node_modules/`), but nothing reads it: ShellCheck has no ignore file, and `run-shellcheck.sh` excludes paths in its own `find` command. The job fails on any error-level finding. | No. Not covered in the suppression table. | A baseline method, and the documentation for it. |
| Gitleaks | `security-secrets.yml` | Yes. `Security Gate (Secrets)` is required on `staging`. | No. | Yes. `.gitleaksignore` (6 entries) and `.gitleaks.toml`. The PR scan is limited to the PR's own commits. | Yes. Fingerprint in `.gitleaksignore`, or an `allowlist` entry. | Nothing. |
| Dependency Review | `security-supply-chain.yml` | No. `warn-only: true`, and not a required check. | No. | Yes, derived from the dependency graph: it compares base and head manifests. `allow-ghsas` is empty. | Yes. `allow-ghsas` | Nothing. |
| npm audit | `security-supply-chain.yml` | No. `continue-on-error`, and not a required check. | No. | No. It reports every advisory on every run. | No. Docs say "None. Patch or accept." | A baseline method (an allowlist of accepted advisories), and the documentation for it. |
| lockfile-lint | `security-supply-chain.yml` | No. `continue-on-error`, and not a required check. | No. | No. | No. | A baseline method, and the documentation for it. |
| Trivy (`fs`) | `security-supply-chain.yml` | No. `continue-on-error`, and not a required check. | No. | No. There is no `.trivyignore`. | Partly. Security tab dismissal only. | An in-repo baseline method (`.trivyignore` or equivalent), and its documentation. |
| Trivy (`fs`) | `security-compare.yml` | No. The job fails if the branch has a finding that `staging` doesn't, but it is not a required check. | No. | Yes, derived from a scan of `staging` in the same job on every run, so it needs no refresh. Findings are compared by identity (`ruleId`, package and file), not by count. | n/a, since staging is rescanned each run. | It isn't a required check. Also, the summary has no cap on the number of findings it lists. |
| Trivy (`config`) | `security-containers.yml` | No. Not a required check, and the containers gate is not required either. | No. | No. | Partly. Security tab dismissal only. | An in-repo baseline method, and its documentation. |
| Trivy (`image`, core image) | `security-containers.yml` | No. Scans run with `exit-code: '0'`. | No. | No. `container-findings-triage.md` describes a VEX file at `.vex/ef-cms.openvex.json`, but that file is not in the repo, and no workflow passes `--vex`. | Partly. The VEX update steps are documented, and Security tab dismissal is documented. | The VEX file itself, or another in-repo method. |
| Trivy (`image`, runtime base images) | `security-containers.yml` | No. Scans run with `exit-code: '0'`. | No. | No. Same as the core image. | Same as the core image. | Same as the core image. |
| ZAP API Scan | `security-dast.yml` | No. `continue-on-error`, and not a required check. | No. | Partly. `.zap/rules.tsv` sets handling per rule (three `WARN` lines, no `IGNORE`), not per alert. | Yes. `IGNORE` line in `.zap/rules.tsv` | Per-alert baselining (rule ID plus URL), and a comparison against staging. |
| ZAP Public API Baseline Scan | `security-dast.yml` | No. `continue-on-error`, and not a required check. | No. | Partly. Same `.zap/rules.tsv`. | Yes. Same file. | Same as the ZAP API Scan, plus the SARIF converter (#10412) so results reach the Security tab. |

## Branch rules today

Read from the repository's rulesets (`gh api repos/ustaxcourt/ef-cms/rulesets`) on 2026-11-02.

| Branch | Approvals | Required status checks | Other rules |
|--------|-----------|------------------------|-------------|
| `staging` | 2: one from each of two teams. | The functional checks, `Security Gate (SAST)` and `Security Gate (Secrets)`. The PR branch must be up to date with `staging`. | CodeQL code-scanning rule (high or higher). Restrictions on force-push, deletion, creation and update of the ref. |
| `test` | 3: one from one team, two from the other. | The functional checks only. The PR branch need not be up to date. | No force-push, no deletion. |
| `develop`, `irs` | 3, as on `test`. | The functional checks only. | None. |
| `prod` | None. | The functional checks only. | Same restrictions as `staging`: force-push, deletion, creation and update of the ref. |

No ruleset lists a bypass actor. Nobody can merge past a failing required check without first changing the ruleset.

## Baseline and comparison behavior

**The baseline branch is `staging`.** Findings that exist on `staging` are accepted pre-existing debt. A pull request is judged only on findings it adds. Production is built from `staging`, so nothing reaches production that `staging` has not already accepted.

`test` is a dry run of the `staging` PR: it is `staging` plus the developer's branch. Its baseline is therefore `staging`'s baseline, not a second one. Developers sync their branch with `staging` before opening a PR into `test`. Scan results from `test` are not uploaded to the Security tab, so `test` has no alert state of its own. It can only catch new findings, by comparing against `staging`.

### What counts as a new finding

| Tool | A finding is new when | Compared against, PR into `staging` | Compared against, PR into `test` today | Needed for `test` to match `staging` |
|------|-----------------------|-------------------------------------|----------------------------------------|--------------------------------------|
| Semgrep | It is on a line the PR changed since the merge base. | `staging`'s tip. | `test`'s tip, so it scores only the PR's own change, which is what the later `staging` PR will see. | Nothing, once the gates are required on `test`. |
| Checkov | It is not in the directory's `.checkov.baseline`. Only the four hard-fail checks block. | The baseline file on the PR's branch. | Same. | Nothing. |
| CodeQL | The alert is not already open on `staging`. The `staging` code-scanning rule blocks new high-or-higher alerts. | Alert state on `staging`. | Nothing. The job only has to complete. | A decision: leave ungated, or add a step that diffs the local SARIF against `staging`'s alerts. |
| ShellCheck | Any error-level finding. There is no baseline. | n/a | n/a | Nothing. |
| Gitleaks | It is in a commit that belongs to the PR and is not in `.gitleaksignore` or `.gitleaks.toml`. | The PR's own commits. | Same: `base.sha..head.sha`, with `base.sha` being `test`'s tip. A merge of `staging` into the branch also falls in the range. Those commits already passed the `staging` gate. | Nothing. |
| Dependency Review | A manifest change adds a vulnerable dependency. Warn-only. | The base branch's manifests. | `test`'s manifests. | Nothing for now, since it does not block. |
| Trivy `fs` (`Findings vs staging`) | The rule, package and file combination is not in a Trivy scan of `staging` made in the same job. HIGH, CRITICAL and UNKNOWN, vulnerabilities only. | `staging`, scanned on every run. | Same. | Require the check (item 2 below). |

Trivy `config`, Trivy `image`, npm audit, lockfile-lint and ZAP have no comparison. They report everything on every run.

### Where the `test` comparison is not exact

- The Trivy compare scans the PR as a merge into its base branch. On a `test` PR that includes commits other developers have merged to `test` but not yet to `staging`. A finding introduced by someone else's branch can show up as new on yours, and the chance grows with the number of unpromoted branches on `test`.
- Semgrep baselines against `test`'s tip, so a finding another branch put on `test` is treated as accepted. That is safe once the gates are required on `test`, because anything on `test` then either passed the gate or carries a suppression. It also matches what the `staging` PR will see, which is only your branch's own change. Pointing the baseline at `staging` would instead report other developers' unpromoted code on your PR.
- `Findings vs staging` and Dependency Review run on PRs into `test`, but neither is a required check anywhere, so neither blocks a merge.

### Required for `test` to catch new findings

`test` requires approvals and the functional checks today, and no security check. To block PRs on new findings without uploading anything:

1. Require `Security Gate (SAST)` and `Security Gate (Secrets)` on `test`, as on `staging`.
2. Require `Findings vs staging` on `test`, so new Trivy `fs` findings block there too.
3. Decide how CodeQL behaves on `test`, as described above.
4. Resolve the docs-only case. These workflows skip docs-only PRs with `paths-ignore`, and a required check that is skipped stays pending, so a docs-only PR cannot merge. Remove `paths-ignore` from the gate workflows, or add a gate that always reports a status.

None of these changes have been made. Each is a ruleset or workflow edit for a follow-up ticket.

## Establishing the baseline

The baseline is `staging`'s own scan results, plus the files that record accepted findings. Every push to `staging` rescans the whole tree with Semgrep, Checkov, CodeQL, Trivy `fs` and Gitleaks, so those baselines refresh themselves. Nothing has to be run by hand to create them.

[See Triage Dashboard](https://calm-mud-04b384a0f.4.azurestaticapps.net/) - updated every Monday, after `ef-cms` code scanning workflows post production merge are complete.

Result counts are per analysis. They are not the open-alert totals in the weekly triage. To list the newest analysis per category again:

```sh
gh api "repos/ustaxcourt/ef-cms/code-scanning/analyses?ref=refs/heads/staging&per_page=100" \
  --jq '.[] | [.category, .created_at[:10], .results_count, .tool.name] | @tsv' \
  | sort -k1,1 -k2,2r | awk -F'\t' '!seen[$1]++'
```

This reads only the first 100 analyses, so a category whose latest upload is older than that may be missing. Add `--paginate` to cover them all.

What runs on `staging`, and what doesn't:

| Runs on a `staging` push | Runs on a schedule | Never runs on `staging` |
|--------------------------|--------------------|-------------------------|
| Semgrep (full tree, no failing exit), Checkov, CodeQL, Trivy `fs`, Gitleaks baseline. All skip a push that changes only `docs/badges/**`. | Trivy `image` baselines (also on a push that changes image paths) and ZAP web, Mondays 06:00 UTC. | ShellCheck, Dependency Review, npm audit and lockfile-lint (PR only). Trivy `config` (PR and manual; the weekly triage starts it by hand). |

Gaps in how the baseline stays current:
- SAST, secrets and supply-chain have no Monday run. A CVE newly published against unchanged code reaches the `trivy` category only on the next push to `staging`.
- ShellCheck never runs on `staging` and has no baseline, so it can only fail a PR on what that PR changes. Checkov's comparison is the `.checkov.baseline` files, not the alerts it uploads.
- npm audit covers the root lockfile only, and only on PRs. The weekly triage audits all three lockfiles by hand.

## Protecting the baseline

The accepted baseline grows whenever something stops a finding from failing or showing. These are the ways that happens, and what stops each one today.

| Way the baseline grows | Stopped by today | Gap |
|------------------------|------------------|-----|
| A PR merges to `staging` with a new finding | `Security Gate (SAST)`, `Security Gate (Secrets)` and the CodeQL rule. | Checkov findings outside the four hard-fail checks, new Trivy `fs` findings and new Dependency Review findings merge without failing. `Findings vs staging` is not required. |
| A PR adds a suppression or baseline entry: `nosemgrep`, `#checkov:skip`, `shellcheck disable`, `.checkov.baseline`, `.gitleaksignore`, `.gitleaks.toml`, `.zap/rules.tsv`, `allow-ghsas` | A reviewer noticing it. There is no `CODEOWNERS` file. | Nothing enforces the approver's sign-off. |
| A PR widens what the scans skip: `--exclude` or `--skip-check` in `security-sast.yml`, `paths-ignore` in a workflow or in `.github/codeql/codeql-config.yml` | Same. | Same. |
| An alert is dismissed in the Security tab | Write access to the repository. | Dismissals are not reviewed anywhere in code. |
| A commit reaches `prod` without passing through `staging` | Nothing in the security checks. `prod` requires only the functional checks, and no security workflow runs on a `prod` push. | A commit made directly on `prod` is never scanned. |
| A suppression merges to `test` and the same branch is then refused at `staging` | Nothing. | `test` then carries an acceptance that `staging` has not made. |

Proposed:
1. **Add `CODEOWNERS` entries** for the suppression files, `security-*.yml`, `.github/codeql/` and `.zap/`, owned by the approver or a security team, and set `require_code_owner_review` on `test` and `staging`. A listed path is the only thing that then needs the approver's review, so the playbook's sign-off rule becomes enforced rather than asked for. The `staging` ruleset already requires reviewers by team, so the alternative is a path-scoped entry in that rule's `required_reviewers`.
2. **Treat `staging` as the only source for `prod`.** Promotion is a merge of `staging` into `prod` by the court's operations staff ([pr-workflow.md](../../pr-workflow.md)), so a promotion adds nothing `staging` has not accepted. To make that provable, require the two security gates on `prod` as well. They would pass on a clean promotion.
3. **Review suppressions on `test` once.** The approver signs off on the `test` PR, as in [Remediating or accepting a failure](#remediating-or-accepting-a-failure). The `staging` PR for the same branch is then judged only by the gates. A suppression that is refused at `staging` is removed from `test` by reverting that branch.
4. **List dismissals in the weekly triage.** Add `state=dismissed` alerts since the last triage to [weekly-triage.md](weekly-triage.md), so every dismissal has a record and a review date.

## Emergency security fixes

There is no documented hotfix path today. The [playbook](playbook.md#same-day-triage) already defines what counts as an emergency: a possible secret, a KEV-listed or publicly exploited vulnerability in T1 or T2, or a finding reported by a person. This section covers how the fix then reaches `staging` and `prod`. It is a proposal.

**The gates are not bypassed.** No ruleset has a bypass actor, and the gates only fail on findings the PR adds. A fix that removes a finding passes them. Skipping a gate would need a ruleset change, and that is not part of this path.

1. **Triage the same day.** Follow [Same-day triage](playbook.md#same-day-triage). The approver opens the draft advisory and is told directly. For a secret, rotate first ([Secrets](playbook.md#secrets)); the code change is the clean-up, not the fix.
2. **Branch from `staging`** and change only what the fix needs. Open the PR into `staging`. `test` may be skipped when the approver agrees on the PR, because `test` is a dry run for the same gates. Skipping it also skips the product owner's check in the `test` environment.
3. **If the fix trips a gate,** fix that finding. If it cannot be fixed, the approver signs off on the PR the same day, the suppression goes on the branch, and the ticket is logged before merge. An emergency shortens the wait for sign-off, not what is recorded. See [Remediating or accepting a failure](#remediating-or-accepting-a-failure).
4. **Ask for the earlier deploy** as soon as the PR merges. [Deploys follow the court's schedule](playbook.md#what-counts-as-resolved), and the playbook already has the owner ask the court for an earlier one for a Critical or High finding in T1. Court operations merge `staging` into `prod`.
5. **Back-merge `staging` into `test`** afterwards so `test` carries the fix.

Decisions needed:
- **An out-of-band deploy ships everything on `staging`,** including work that was waiting for the next window. If that is not acceptable, the alternative is a branch from `prod` with a PR back into `prod`, then a merge into `staging`. That path would run no security checks on `prod` unless item 2 under [Protecting the baseline](#protecting-the-baseline) is done, and `pr-workflow.md` says Gunnison developers never touch `prod`.
- **Whether skipping `test` is allowed at all.** `pr-workflow.md` has the product owner verify on `test`, or on an experimental environment.

## Remediating or accepting a failure

The steps are already written. This section adds only what the baseline strategy changes: the suppression is committed on the developer's own branch, and the scan must then stay quiet for later PRs.

1. **Fix it in the PR.** See [When Devs are expected to fix alerts](#when-devs-are-expected-to-fix-alerts-caused-by-their-changes).
2. **If it cannot be fixed,** log the ticket, get the approver's sign-off, and record the decision in the [exception record](playbook.md#the-exception-record). The playbook's order is remove, patch, upgrade, suppress, then accept.
3. **Commit the suppression on your branch,** after the ticket exists, in the form the tool reads. Put the ticket number in the suppression's reason. For a sensitive finding, use the GHSA ID instead and keep the reasoning in the advisory ([Suppressing a finding](playbook.md#suppressing-a-finding)).
4. **Re-run the checks.** For the tools marked "Yes" below, later PRs into `test` and `staging` then do not report the same finding at the same place.

Where each scanner reads the suppression, and what is missing. The full list of mechanisms is in [scanner-reference.md](scanner-reference.md#suppression-mechanisms).

| Tool | Commit on your branch | Quiet on later PRs? | Gap |
|------|-----------------------|---------------------|-----|
| Semgrep | `// nosemgrep: <rule-id>` above the line | Yes. It travels with the line. | None. |
| Checkov | `#checkov:skip=<ID>:<ticket>` in the resource | Yes. | The four hard-fail checks should be fixed, not skipped. How to regenerate a `.checkov.baseline` is undocumented. |
| CodeQL | None verified | No on `staging`: a new alert stays open until dismissed in the Security tab, and the `staging` rule blocks on it. On `test` nothing is gated yet. | A decision, below. |
| ShellCheck | `# shellcheck disable=SC<number>` above the line | Yes. | The form is not in `scanner-reference.md`. |
| Gitleaks | `.gitleaksignore` fingerprint, in a separate PR, after the secret is rotated if it was real | Yes, once the file is on the branch the PR is compared with. | A real secret is never deferred. |
| Dependency Review | `allow-ghsas` in `security-supply-chain.yml` | Not applicable while `warn-only`. | None until it blocks. |
| Trivy `fs` | None. The check keeps flagging the finding until it reaches `staging`. | No. | See below. |
| Trivy `image`, `config`, ZAP | None for `image` and `config`; `IGNORE` in `.zap/rules.tsv` for ZAP | Nothing blocks on these today. | None until they block. |

**Trivy `fs` needs an ignore file to meet the goal.** `aquasecurity/trivy-action@v0.36.0` takes a `trivyignores` input, a list of `.trivyignore` files or one `.trivyignore.yaml`. The YAML form has `id`, `paths`, `purls`, `expired_at` and `statement` fields, so an entry can name the location, carry the ticket, and expire on the playbook's review date. Passing the file to the branch scan in `security-compare.yml` makes that finding stop being "new". Leaving it off the `trivy` job that uploads from `staging` keeps the alert open in the Security tab as the record. Trivy's own docs mark `.trivyignore.yaml` experimental, so confirm it works with the pinned version before relying on it.

**VEX does not do this job.** No workflow passes `--vex`, `trivy-action@v0.36.0` has no VEX input, and Trivy applies only `not_affected` and `fixed` statements. An accepted finding is `affected`, so a VEX file cannot silence it. The playbook also keeps `affected` statements for T1 and T2 out of the public file.

**CodeQL is undecided.** The options are: leave `test` ungated; add a gate step that diffs the local SARIF against `staging`'s open alerts; or an inline `// codeql[<rule-id>]` suppression comment. The syntax and whether our config reads it are unverified. Excluding a rule in `.github/codeql/codeql-config.yml` is not an option: the config is shared with the `staging` uploads, so it would close the `staging` alert as well.

## When Devs are expected to fix alerts caused by their changes

These are proposed expectations for the team. Where they differ from the [playbook](playbook.md), the playbook still applies until it is changed.

**Fix it in the PR that caused it.** A finding that appears in your PR because of your change is cheapest to fix now, while the code is fresh and before it reaches `test` or `staging`. Don't wait for the weekly triage, and don't merge on the assumption that someone else will pick it up. The [playbook](playbook.md#missing-an-sla) holds new code to a stricter standard than existing findings: it must not add medium- or high-severity findings at all.

Findings already in the baseline are not your responsibility, and they don't block your PR. They are worked through the SLAs in the [playbook](playbook.md#remediation-slas).

### When a fix can be deferred to a ticket

Defer only when one of these is true:
- The fix is too large for this PR AND **is not** in scope for your branch's changes.
- No fix exists yet, for example the package has no patched release.

If so:
1. Log a Jira ticket before you merge, using the title format in [Ownership](playbook.md#ownership). For now Jira holds these tickets. The playbook tracks findings as GitHub issues on the ZenHub board, so it needs the same change before this is adopted.
2. Get the approver's (tech lead or delegate) sign-off on the PR. Every deferral, suppression and risk acceptance needs it, at every severity ([Suppressing a finding](playbook.md#suppressing-a-finding)).
3. Record the decision in the ticket using the [exception record](playbook.md#the-exception-record). For a Trivy `fs` or `image` finding, this proposal adds a [VEX statement](playbook.md#vex-statements), whether or not the fix lands in your branch. The playbook is narrower: it publishes only `not_affected` and `fixed` statements, and keeps `affected` ones for T1 and T2 in the advisory.
4. If there is no upstream fix, work through [No upstream fix](playbook.md#no-upstream-fix) first. "No patch" alone isn't a reason to accept a finding.

To suppress a finding in a scanner, see [Suppression mechanisms](scanner-reference.md#suppression-mechanisms) and [Remediating or accepting a failure](#remediating-or-accepting-a-failure). Unless the tech lead has authorized it, if your change causes a finding, you fix it.

**Never deferred:** a real secret. Rotate it the same business day and follow [Secrets](playbook.md#secrets).

### Semgrep and CodeQL
**Compares against:** Semgrep, the PR's base branch, reporting only findings in code your PR changed. CodeQL, the alerts open on `staging`.

- **Semgrep blocks your PR** (`Security Gate (SAST)`). Fix the flagged code. See [If your PR is blocked by Semgrep](../sast-scanning.md#if-your-pr-is-blocked-by-semgrep).
- **CodeQL blocks a PR into `staging`** for new high-or-higher alerts. Fix the alert, or have the approver agree to a dismissal in the Security tab with a tracking record.
- **PRs into `test`:** Results aren't uploaded, so read the job log and fix what it reports. Don't leave it for the `staging` PR.

### npm audit and Trivy fs
**Compares against:** nothing, except Dependency Review (changed dependencies, high and above) and `Findings vs staging` (new Trivy fs findings not on `staging`, matched by CVE, package and file).

These don't block your PR, so a green check doesn't mean you added nothing. If your PR changes `package.json` or the lockfile, check the Dependency Review and `Findings vs staging` summaries, and take the fix by updating the dependency ([Patching npm dependencies](playbook.md#patching-npm-dependencies)). If you can't, defer with a ticket as above.

### Gitleaks
**Compares against:** the commits in your PR only.

A real secret is never deferred: rotate it and clean it up ([Secrets](playbook.md#secrets)). A false positive goes in `.gitleaksignore` in a separate PR with the approver's sign-off ([Secrets scanning](../secrets-scanning.md#2-pr-ci-gate-blocking)).

### Checkov (Terraform)
**Compares against:** the directory's `.checkov.baseline`.

Only the four hard-fail checks block your PR. Fix the resource for all of them. For other Checkov findings your change adds, fix them too. If one can't be fixed, prefer an inline `#checkov:skip=<CHECK_ID>:<reason>` over adding to a baseline file, and get the approver's sign-off.

### ShellCheck
**Compares against:** nothing. Any error-level finding blocks the PR.

Fix the error in the PR. Don't add paths to `.shellcheckignore`: nothing reads it, and ShellCheck has no ignore file. Excluding a path means editing the `find` command in `run-shellcheck.sh`. A single false positive can be suppressed inline with `# shellcheck disable=SC<number>` above the line, with the approver's sign-off and a one-line reason. That form isn't in the suppression table in `scanner-reference.md` yet.
