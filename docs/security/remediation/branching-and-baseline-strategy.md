# Branching and Baseline Strategy

A baseline is a recorded set of accepted pre-existing findings, so a pull request fails only on findings it introduces.

**The strategy.** Three workflows are required checks on PRs into both `test` and `staging`. The first two already are on `staging`; `Findings vs staging` is the new one on both:

| Workflow | Required check | Catches |
|----------|----------------|---------|
| `security-sast.yml` | `Security Gate (SAST)` | New static code issues |
| `security-secrets.yml` | `Security Gate (Secrets)` | New secrets in the PR's commits |
| `security-compare.yml` ("Security - No New Findings") | `Findings vs staging` | New Trivy `fs` findings, including CVEs published since the code merged |

A finding is caught on `test` and again on `staging`, before it can merge to `staging`, and `staging` stays the accepted baseline, so it doesn't grow. The other scans (dependency review, npm audit, lockfile-lint, container scans and ZAP) are out of scope.

In the table below, "PR gate (staging)" means the tool can block a merge into `staging`, according to the `staging` branch rulesets. Today no security check is required on `test`; see [Branch rules today](#branch-rules-today).

## Assumptions (READ FIRST)
This document was written with the following assumptions in mind:
1. **If a particular branch introduces a finding, that branch should fix it.** If it doesn't significantly increase scope, a branch should also fix any other new finding it detects, as long as the weekly scan team isn't already addressing it.
2. We want to keep the baseline of findings on `staging` from growing with new blocking-severity findings, by requiring each one to be fixed or temporarily risk-accepted (advisory, sign-off and an expiring ignore) before it merges there. For Trivy `fs` that means new HIGH, CRITICAL and UNKNOWN vulnerabilities. CVEs published against unchanged code, and findings below the blocking thresholds, are handled by the weekly scan team.
3. We detect new SAST, secrets and Trivy `fs` findings on PRs into both `test` and `staging`, giving us two opportunities to catch them before they make it into `staging`. CodeQL on `test` follows once its comparison step is built.

## Contents

- [Per-tool baseline status](#per-tool-baseline-status)
- [Branch rules today](#branch-rules-today)
- [Baseline and comparison behavior](#baseline-and-comparison-behavior)
  - [What counts as a new finding](#what-counts-as-a-new-finding)
  - [Required for `test` to catch new findings](#required-for-test-to-catch-new-findings)
  - [Trivy fs findings](#trivy-fs-findings)
- [Establishing the baseline](#establishing-the-baseline)
- [Protecting the baseline](#protecting-the-baseline)
- [Emergency security fixes](#emergency-security-fixes)
- [Remediating or accepting a failure](#remediating-or-accepting-a-failure)
  - [CodeQL on `test`](#codeql-on-test)

## Per-tool baseline status

"In repo" means the baseline or suppression lives in a file that is committed and reviewed with the code. "Documented" means [scanner-reference.md](scanner-reference.md) or the tool's own page in this folder explains how to add to it.

| Tool | Workflow | PR gate (staging) | Baseline method in the repo | Documented way to add or refresh | What's missing |
|------|----------|---------|-----------------------------|----------------------------------|----------------|
| Semgrep | `security-sast.yml` | Yes. `Security Gate (SAST)` is required on `staging`. | Yes, derived from git: `--baseline-commit` against the merge base. No file to maintain. | Yes. `// nosemgrep: <rule-id>` | Nothing. |
| Checkov | `security-sast.yml` | Partly. `Security Gate (SAST)` fails only for four hard-fail checks; the rest are `--soft-fail`. | Yes, nine `.checkov.baseline` files. Only `allColors` and `account-specific` have entries. | Partly. Docs say to add an accepted finding to the baseline, with `#checkov:skip` preferred for new ones, but not how to regenerate the file. | The command and steps to regenerate a baseline. |
| CodeQL | `security-sast.yml` | Yes. The code-scanning rule on `staging` blocks new high-or-higher alerts, and `Security Gate (SAST)` requires the job to complete. | No file. Baseline is alert state on staging, compared by the `staging` ruleset's code-scanning rule. | Yes. Security tab dismissal with a required comment format. | Nothing in the repo. The baseline depends on staging uploads continuing. |
| ShellCheck | `security-sast.yml` | Yes. `Security Gate (SAST)` is required on `staging`. | No. `.shellcheckignore` holds one line (`node_modules/`), but nothing reads it: ShellCheck has no ignore file, and `run-shellcheck.sh` excludes paths in its own `find` command. The job fails on any error-level finding. | No. Not covered in the suppression table. | A baseline method, and the documentation for it. |
| Gitleaks | `security-secrets.yml` | Yes. `Security Gate (Secrets)` is required on `staging`. | Yes. `.gitleaksignore` (6 entries) and `.gitleaks.toml`. The PR scan is limited to the PR's own commits. | Yes. Fingerprint in `.gitleaksignore`, or an `allowlist` entry. | Nothing. |
| Trivy (`fs`), the `trivy` job that uploads from `staging` | `security-supply-chain.yml` | No. `continue-on-error`, and not a required check. | No. There is no `.trivyignore`. | Partly. Security tab dismissal only. | An in-repo baseline method (`.trivyignore` or equivalent), and its documentation. |
| Trivy (`fs`) | `security-compare.yml` | Planned: required on `test` and `staging`. Today the job fails if the branch has a finding that `staging` doesn't, but it is not a required check. | Yes, derived from a scan of `staging` in the same job on every run, so it needs no refresh. Findings are compared by identity (`ruleId`, package and file), not by count. | n/a, since staging is rescanned each run. | A ruleset change to require it on `test` and `staging`, and the docs-only fix. Also, the summary has no cap on the number of findings it lists. |

## Branch rules today

Read from the repository's rulesets (`gh api repos/ustaxcourt/ef-cms/rulesets`) on 2026-11-02.

| Branch | Approvals | Required status checks | Other rules |
|--------|-----------|------------------------|-------------|
| `staging` | 2: one from each of two teams. | The functional checks, `Security Gate (SAST)` and `Security Gate (Secrets)`. The PR branch must be up to date with `staging`. | CodeQL code-scanning rule (high or higher). Restrictions on force-push, deletion, creation and update of the ref. |
| `test` | 3: one from one team, two from the other. | The functional checks only. The PR branch need not be up to date. | No force-push, no deletion. |


## Baseline and comparison behavior

**The baseline branch is `staging`.** Findings that exist on `staging` are accepted pre-existing debt. A pull request is judged only on findings it adds.

`test` is a dry run of the `staging` PR: it is `staging` plus the developer's branch. Its baseline is therefore `staging`'s baseline, not a second one. Developers sync their branch with `staging` before opening a PR into `test`. Scan results from `test` are not uploaded to the Security tab, so `test` has no alert state of its own. It can only catch new findings, by comparing against `staging`.

### What counts as a new finding

| Tool | A finding is new when | Compared against, PR into `staging` | Compared against, PR into `test` today | Needed for `test` to match `staging` |
|------|-----------------------|-------------------------------------|----------------------------------------|--------------------------------------|
| Semgrep | It is on a line the PR changed since the merge base. | `staging`'s tip. | `test`'s tip, so it scores only the PR's own change, which is what the later `staging` PR will see. Pointing at `staging` would instead report other developers' unpromoted code. | Nothing, once the gates are required on `test`. If blocked, see [If your PR is blocked by Semgrep](../sast-scanning.md#if-your-pr-is-blocked-by-semgrep). |
| Checkov | It is not in the directory's `.checkov.baseline`. Only the four hard-fail checks block. | The baseline file on the PR's branch. | Same. | Nothing. Fix the hard-fail checks rather than skipping them, and fix other findings your change adds too. |
| CodeQL | The alert is not already open on `staging`. The `staging` code-scanning rule blocks new high-or-higher alerts. | Alert state on `staging`. | Nothing. The job only has to complete, and its results aren't uploaded, so read the job log and fix what it reports rather than leaving it for the `staging` PR. | Decided: add a step to `Security Gate (SAST)` that diffs the local SARIF against `staging`'s open alerts ([CodeQL on `test`](#codeql-on-test)). |
| ShellCheck | Any error-level finding. There is no baseline. | n/a | n/a | Nothing. Don't add paths to `.shellcheckignore`: nothing reads it. |
| Gitleaks | It is in a commit that belongs to the PR and is not in `.gitleaksignore` or `.gitleaks.toml`. | The PR's own commits. | Same: `base.sha..head.sha`, with `base.sha` being `test`'s tip. A merge of `staging` into the branch also falls in the range. Those commits already passed the `staging` gate. | Nothing. A false positive goes in `.gitleaksignore` in a separate PR with the approver's sign-off ([Secrets scanning](../secrets-scanning.md#2-pr-ci-gate-blocking)). |
| Trivy `fs` (`Findings vs staging`) | The rule, package and file combination is not in a Trivy scan of `staging` made in the same job. HIGH, CRITICAL and UNKNOWN, vulnerabilities only. | `staging`, scanned on every run. | Same, but the scan merges the PR into `test`, so another branch's unpromoted finding can show as new on yours. | Decided: require the check on `test` and `staging` (item 2 below). |

### Required for `test` to catch new findings

`test` requires approvals and the functional checks today, and no security check. To block PRs on new findings without uploading anything:

1. Require `Security Gate (SAST)` and `Security Gate (Secrets)` on `test`, as on `staging`.
2. Require `Findings vs staging` on `test` and `staging`, so a new Trivy `fs` finding must be fixed or temporarily risk-accepted before it merges to either. This is decided. A person reads the result, so the developer fixes what their branch caused and logs what it didn't ([Findings on pull requests](playbook.md#findings-on-pull-requests)).
3. Add the CodeQL comparison step to `Security Gate (SAST)`, so CodeQL blocks new high-or-higher alerts on `test` as the code-scanning rule does on `staging` ([CodeQL on `test`](#codeql-on-test)). This is decided.
4. Resolve the docs-only case. `security-sast.yml` and `security-compare.yml` skip PRs that change only Markdown, `.gitignore`, `.nvmrc` or `docs/**` (SAST also skips `.circleci/config.yml`). `security-secrets.yml` skips only `.gitignore` and `.nvmrc`. A required check that is skipped stays pending, so a docs-only PR cannot merge. This applies to both `test` and `staging` once the checks are required on both. Remove `paths-ignore` from the gate workflows, or add a gate that always reports a status.

None of these changes have been made. Each is a ruleset or workflow edit for a follow-up ticket.

### Trivy fs findings

The required checks are the SAST and Secrets gates and `Findings vs staging` (Trivy `fs`). Container scans are not part of this strategy. Static code issues are caught before they reach `staging`, and so are CVEs published since the code last merged, on both `test` and `staging`.

When `Findings vs staging` fails, the developer follows [Trivy fs findings](playbook.md#trivy-fs-findings) in the playbook. If their change caused the finding, or the PR is the weekly scan work, they take the published fix if this week's dependency update doesn't already have it, or check whether the CVE applies, record it in VEX, open a draft security advisory and add an expiring `.trivyignore` line. If their change didn't cause it, for example a CVE published since the code merged, or another PR's unpromoted dependency on `test`, they first tell the weekly scan team and add the alert number to the weekly scan ticket, so the two efforts don't cover the same ground. If the fix is small and the team isn't already on it, they fix it in the PR. If the fix would blow the PR's scope, such as a package update that forces many API reference changes or needs testing well beyond what the story covers, they leave it with the weekly scan team and don't open a ticket or advisory. So that their PR isn't blocked, they add an expiring `.trivyignore` line themselves, set to the Saturday before the next weekly scan, since no ruleset has a bypass actor. Because the check also runs on the `staging` PR, a CVE published between the `test` PR and the `staging` PR can block the `staging` PR, and the same steps apply. The mechanics of that ignore line are under [Remediating or accepting a failure](#remediating-or-accepting-a-failure).

## Establishing the baseline

The baseline is `staging`'s own scan results, plus the files that record accepted findings. Every push to `staging` rescans the whole tree with Semgrep, Checkov, CodeQL, Trivy `fs` and Gitleaks, so those baselines refresh themselves. Nothing has to be run by hand to create them.

[See Triage Dashboard](https://calm-mud-04b384a0f.4.azurestaticapps.net/) - updated every Monday, after the `ef-cms` code scanning workflows on `staging` are complete.


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
| Semgrep (full tree, no failing exit), Checkov, CodeQL, Trivy `fs`, Gitleaks baseline. All skip a push that changes only `docs/badges/**`. | None. | ShellCheck (PR only). |

Gaps in how the baseline stays current:
- SAST, secrets and Trivy `fs` have no scheduled run. A CVE newly published against unchanged code reaches the `trivy` category only on the next push to `staging`.
- ShellCheck never runs on `staging` and has no baseline. `run-shellcheck.sh` scans every `.sh` file, not only the ones a PR changes, so an error-level finding in an untouched script fails any PR. This is the one exception to the new-findings-only rule. Fix it or add a `shellcheck disable` on the PR that hits it. Checkov's comparison is the `.checkov.baseline` files, not the alerts it uploads.

## Protecting the baseline

The accepted baseline grows whenever something stops a finding from failing or showing. These are the ways that happens, and what stops each one today.

| Way the baseline grows | Stopped by today | Gap |
|------------------------|------------------|-----|
| A PR merges to `staging` with a new finding | `Security Gate (SAST)`, `Security Gate (Secrets)` and the CodeQL rule. | Checkov findings outside the four hard-fail checks merge without failing, and so do findings below the Trivy `fs` thresholds (HIGH, CRITICAL and UNKNOWN). `Findings vs staging` is not required yet; it is planned for `test` and `staging`. |
| A PR adds a suppression or baseline entry: `nosemgrep`, `#checkov:skip`, `shellcheck disable`, `.checkov.baseline`, `.gitleaksignore`, `.gitleaks.toml`, `.trivyignore` | A reviewer noticing it. | Nothing enforces the approver's sign-off. |
| A PR widens what the scans skip: `--exclude` or `--skip-check` in `security-sast.yml`, `paths-ignore` in a workflow or in `.github/codeql/codeql-config.yml` | Same. | Same. |
| An alert is dismissed in the Security tab | Write access to the repository. | Dismissals are not reviewed anywhere in code. |
| A suppression merges to `test` and the same branch is then refused at `staging` | Nothing. | `test` then carries an acceptance that `staging` has not made. |

Proposed:
1. **Require the approver's review on the suppression files** with a path-scoped entry in the `required_reviewers` of the `test` and `staging` rulesets, covering the suppression files, `security-*.yml` and `.github/codeql/`. A listed path is the only thing that then needs the approver's review, so the playbook's sign-off rule becomes enforced rather than asked for. The `staging` ruleset already requires reviewers by team, so this extends a rule that exists.
2. **Review suppressions on `test` once.** The approver signs off on the `test` PR, as in [Remediating or accepting a failure](#remediating-or-accepting-a-failure). The `staging` PR for the same branch is then judged only by the gates. A suppression that is refused at `staging` is removed from `test` by reverting that branch.
3. **List dismissals in the weekly triage.** Add `state=dismissed` alerts since the last triage to [weekly-triage.md](weekly-triage.md), so every dismissal has a record and a review date.

## Emergency security fixes

The [playbook](playbook.md#same-day-triage) already defines what counts as an emergency: a possible secret, a KEV-listed or publicly exploited vulnerability in T1 or T2, or a finding reported by a person. This section covers how the fix then reaches `staging`.

**The gates are not bypassed.** No ruleset has a bypass actor. Apart from ShellCheck, which scans every script, the gates fail only on findings the PR adds, so a fix that removes a finding passes them.

1. **Triage the same day.** Follow [Same-day triage](playbook.md#same-day-triage). The approver opens the draft advisory and is told directly. For a secret, rotate first ([Secrets](playbook.md#secrets)); the code change is the clean-up, not the fix.
2. **Branch from `staging`** and change only what the fix needs. Open the PR into `staging`. `test` may be skipped when the approver agrees on the PR, because `test` is a dry run for the same gates. Skipping it loses the product owner's check in the `test` environment and the early warning, but not the Trivy check, which also runs on the `staging` PR. If an emergency PR hits a finding it didn't cause, the developer applies the same temporary acceptance on that PR (expiring `.trivyignore` line, as in [Trivy fs findings](#trivy-fs-findings)).
3. **If the fix trips a gate,** fix that finding. If it cannot be fixed, the approver signs off on the PR the same day, the suppression goes on the branch, and the advisory is opened before merge. An emergency shortens the wait for sign-off, not what is recorded. See [Remediating or accepting a failure](#remediating-or-accepting-a-failure).
4. **Ask for the earlier deploy** as soon as the PR merges. [Deploys follow the court's schedule](playbook.md#what-counts-as-resolved), and the playbook already has the owner ask the court for an earlier one for a Critical or High finding in T1.
5. **Back-merge `staging` into `test`** afterwards so `test` carries the fix, and any `.trivyignore` line that came with it.

## Remediating or accepting a failure

The policy is in the [playbook](playbook.md#findings-on-pull-requests). This section adds only what the baseline strategy changes: the suppression is committed on the developer's own branch, and the scan must then stay quiet for later PRs.

1. **Fix it in the PR.** See [Fix it in the PR that caused it](playbook.md#fix-it-in-the-pr-that-caused-it).
2. **If it cannot be fixed,** open the advisory, get the approver's sign-off, and record the decision in the [exception record](playbook.md#the-exception-record). The playbook's order is remove, patch, upgrade, suppress, then accept.
3. **Commit the suppression on your branch,** after the advisory exists, in the form the tool reads. Put the advisory's GHSA ID in the suppression's reason and keep the reasoning in the advisory ([Suppressing a finding](playbook.md#suppressing-a-finding)).
4. **Re-run the checks.** For the tools marked "Yes" below, later PRs into `test` and `staging` then do not report the same finding at the same place.

How to write the suppression for each scanner is in [scanner-reference.md](scanner-reference.md#suppression-mechanisms). This table covers only what the baseline strategy adds: whether the scan stays quiet for later PRs once the suppression is on your branch, and what is missing.

| Tool | Quiet on later PRs? | Gap |
|------|---------------------|-----|
| Semgrep | Yes. The `nosemgrep` comment travels with the line. | None. |
| Checkov | Yes. | The four hard-fail checks should be fixed, not skipped. How to regenerate a `.checkov.baseline` is undocumented. |
| CodeQL | No on `staging`: a new alert stays open until dismissed in the Security tab, and the `staging` rule blocks on it. On `test` the comparison step will block it once built. No suppression comment is verified. | The comparison step is not built ([CodeQL on `test`](#codeql-on-test)). |
| ShellCheck | Yes. The `shellcheck disable` comment travels with the line. | None. |
| Gitleaks | Yes, once `.gitleaksignore` is on the branch the PR is compared with. It goes in a separate PR, after rotation if the secret was real. | None. |
| Trivy `fs` | Yes, for both the branch scan and the `staging` scan, while the `.trivyignore` entry has not expired. The deferred finding's issue or advisory is its record. When the entry expires the finding shows again in the Security tab, so an unfixed one comes back to attention. Expiry doesn't block PRs: both scans read the same file, so the finding is on both sides and no longer new. | Needs the ignore file below. |

**Trivy `fs` uses a `.trivyignore` file.** `aquasecurity/trivy-action@v0.36.0` takes a `trivyignores` input, a list of `.trivyignore` files or one `.trivyignore.yaml`. The plain `.trivyignore` takes an `exp:` date after the ID, as in `CVE-2022-1234 exp:2026-11-09`, and matches by ID only, so the advisory's GHSA ID and reason go in a comment above the entry. The playbook's [Trivy fs findings](playbook.md#trivy-fs-findings) sets the expiry to the Monday the next weekly dependency update starts. The YAML form can also scope an entry to a path or purl, but Trivy marks it experimental, so use the plain file unless scoping is needed. Pass the file to the branch scan in `security-compare.yml` so the finding stops being "new". The `trivy` job that uploads from `staging` also reads a root `.trivyignore` by default, which is intended: the point of the file is to catch a new finding early on `test`, and if it isn't caught there, the same check on `staging` catches it. A deferred finding drops off the Security tab until its entry expires, then reappears if it hasn't been fixed. This is not built yet: the file does not exist and the input is not passed. Confirm the format works with the pinned `trivy-action` version first.


### CodeQL on `test`

**Compare, don't upload.** Results from `test` are not uploaded to the Security tab, so the `staging` code-scanning rule can't judge them. Instead, add a step to `Security Gate (SAST)` that reads the SARIF the CodeQL job already produces locally and compares it with `staging`'s open and dismissed alerts (`gh api repos/ustaxcourt/ef-cms/code-scanning/alerts?ref=refs/heads/staging`, without a `state` filter, so a dismissed alert still counts as known). The step fails the gate on a high-or-higher result whose rule and location are not open on `staging`. It writes nothing to the Security tab, so `test` still has no alert state of its own.

This is not built. Open points for the follow-up ticket:
- **Matching.** Line numbers shift between branches, so don't match on line. Match on rule ID and file, and count: a result is new if the PR has more results for that rule and file than `staging` has alerts. Matching on rule and file alone would pass a second vulnerability of the same rule in an already-flagged file. The count still misses a PR that fixes one finding and adds another in the same rule and file. Matching on CodeQL's partial fingerprint would close that gap, but it is unverified that the alerts API returns it.
- **Token.** The gate needs `security-events: read` to list `staging`'s alerts.
- **Severity.** Use the same threshold as the `staging` rule (high or higher), so a PR that passes on `test` passes on `staging`.
- **Suppression.** An inline `// codeql[<rule-id>]` comment is unverified, and whether our config reads it is unknown. Excluding a rule in `.github/codeql/codeql-config.yml` is not an option: the config is shared with the `staging` uploads, so it would close the `staging` alert as well. Until this is settled, an accepted CodeQL finding is dismissed in the Security tab on `staging`, which the comparison still reads as known. That only works once the alert exists on `staging`, so a new finding can't be accepted on `test` ahead of the `staging` PR.
