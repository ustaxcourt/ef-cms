# Branching and Baseline Strategy

A baseline is a recorded set of accepted pre-existing findings, so a pull request fails only on findings it introduces. This table covers the tools that run on pull requests. "PR gate (staging)" means the tool can block a merge into `staging`, according to the `staging` branch rulesets. No security check is required on `test`, `develop`, `irs` or `prod`; see [Branch rules today](#branch-rules-today).

## Contents

- [Per-tool baseline status](#per-tool-baseline-status)
- [Branch rules today](#branch-rules-today)
- [Baseline and comparison behavior](#baseline-and-comparison-behavior)
  - [What counts as a new finding](#what-counts-as-a-new-finding)
  - [Required for `test` to catch new findings](#required-for-test-to-catch-new-findings)
  - [Background scans](#background-scans)
- [Establishing the baseline](#establishing-the-baseline)
- [Protecting the baseline](#protecting-the-baseline)
- [Emergency security fixes](#emergency-security-fixes)
- [Remediating or accepting a failure](#remediating-or-accepting-a-failure)
- [npm audit and Trivy fs](#npm-audit-and-trivy-fs)

## Per-tool baseline status

"In repo" means the baseline or suppression lives in a file that is committed and reviewed with the code. "Documented" means [scanner-reference.md](scanner-reference.md) or the tool's own page in this folder explains how to add to it.

| Tool | Workflow | PR gate (staging) | Baseline method in the repo | Documented way to add or refresh | What's missing |
|------|----------|---------|-----------------------------|----------------------------------|----------------|
| Semgrep | `security-sast.yml` | Yes. `Security Gate (SAST)` is required on `staging`. | Yes, derived from git: `--baseline-commit` against the merge base. No file to maintain. | Yes. `// nosemgrep: <rule-id>` | Nothing. |
| Checkov | `security-sast.yml` | Partly. `Security Gate (SAST)` fails only for four hard-fail checks; the rest are `--soft-fail`. | Yes, nine `.checkov.baseline` files. Only `allColors` and `account-specific` have entries. | Partly. Docs say to add an accepted finding to the baseline, with `#checkov:skip` preferred for new ones, but not how to regenerate the file. | The command and steps to regenerate a baseline. |
| CodeQL | `security-sast.yml` | Yes. The code-scanning rule on `staging` blocks new high-or-higher alerts, and `Security Gate (SAST)` requires the job to complete. | No file. Baseline is alert state on staging, compared by the `staging` ruleset's code-scanning rule. | Yes. Security tab dismissal with a required comment format. | Nothing in the repo. The baseline depends on staging uploads continuing. |
| ShellCheck | `security-sast.yml` | Yes. `Security Gate (SAST)` is required on `staging`. | No. `.shellcheckignore` holds one line (`node_modules/`), but nothing reads it: ShellCheck has no ignore file, and `run-shellcheck.sh` excludes paths in its own `find` command. The job fails on any error-level finding. | No. Not covered in the suppression table. | A baseline method, and the documentation for it. |
| Gitleaks | `security-secrets.yml` | Yes. `Security Gate (Secrets)` is required on `staging`. | Yes. `.gitleaksignore` (6 entries) and `.gitleaks.toml`. The PR scan is limited to the PR's own commits. | Yes. Fingerprint in `.gitleaksignore`, or an `allowlist` entry. | Nothing. |
| Dependency Review | `security-supply-chain.yml` | No. `warn-only: true`, and not a required check. | Yes, derived from the dependency graph: it compares base and head manifests. `allow-ghsas` is empty. | Yes. `allow-ghsas` | Nothing. |
| npm audit | `security-supply-chain.yml` | No. `continue-on-error`, and not a required check. | No. It reports every advisory on every run. | No. Docs say "None. Patch or accept." | A baseline method (an allowlist of accepted advisories), and the documentation for it. |
| lockfile-lint | `security-supply-chain.yml` | No. `continue-on-error`, and not a required check. | No. | No. | A baseline method, and the documentation for it. |
| Trivy (`fs`) | `security-supply-chain.yml` | No. `continue-on-error`, and not a required check. | No. There is no `.trivyignore`. | Partly. Security tab dismissal only. | An in-repo baseline method (`.trivyignore` or equivalent), and its documentation. |
| Trivy (`fs`) | `security-compare.yml` | No. The job fails if the branch has a finding that `staging` doesn't, but it is not a required check. | Yes, derived from a scan of `staging` in the same job on every run, so it needs no refresh. Findings are compared by identity (`ruleId`, package and file), not by count. | n/a, since staging is rescanned each run. | It isn't a required check. Also, the summary has no cap on the number of findings it lists. |
| Trivy (`config`) | `security-containers.yml` | No. Not a required check, and the containers gate is not required either. | No. | Partly. Security tab dismissal only. | An in-repo baseline method, and its documentation. |
| Trivy (`image`, core image) | `security-containers.yml` | No. Scans run with `exit-code: '0'`. | No. `container-findings-triage.md` describes a VEX file at `.vex/ef-cms.openvex.json`, but that file is not in the repo, and no workflow passes `--vex`. | Partly. The VEX update steps are documented, and Security tab dismissal is documented. | The VEX file itself, or another in-repo method. |
| Trivy (`image`, runtime base images) | `security-containers.yml` | No. Scans run with `exit-code: '0'`. | No. Same as the core image. | Same as the core image. | Same as the core image. |
| ZAP API Scan | `security-dast.yml` | No. `continue-on-error`, and not a required check. | Partly. `.zap/rules.tsv` sets handling per rule (three `WARN` lines, no `IGNORE`), not per alert. | Yes. `IGNORE` line in `.zap/rules.tsv` | Per-alert baselining (rule ID plus URL), and a comparison against staging. |
| ZAP Public API Baseline Scan | `security-dast.yml` | No. `continue-on-error`, and not a required check. | Partly. Same `.zap/rules.tsv`. | Yes. Same file. | Same as the ZAP API Scan, plus the SARIF converter (#10412) so results reach the Security tab. |

## Branch rules today

Read from the repository's rulesets (`gh api repos/ustaxcourt/ef-cms/rulesets`) on 2026-11-02.

| Branch | Approvals | Required status checks | Other rules |
|--------|-----------|------------------------|-------------|
| `staging` | 2: one from each of two teams. | The functional checks, `Security Gate (SAST)` and `Security Gate (Secrets)`. The PR branch must be up to date with `staging`. | CodeQL code-scanning rule (high or higher). Restrictions on force-push, deletion, creation and update of the ref. |
| `test` | 3: one from one team, two from the other. | The functional checks only. The PR branch need not be up to date. | No force-push, no deletion. |
| `develop`, `irs` | 3, as on `test`. | The functional checks only. | None. |
| `prod` | None. | The functional checks only. | Same restrictions as `staging`: force-push, deletion, creation and update of the ref. |


## Baseline and comparison behavior

**The baseline branch is `staging`.** Findings that exist on `staging` are accepted pre-existing debt. A pull request is judged only on findings it adds. Production is built from `staging`, so nothing reaches production that `staging` has not already accepted.

`test` is a dry run of the `staging` PR: it is `staging` plus the developer's branch. Its baseline is therefore `staging`'s baseline, not a second one. Developers sync their branch with `staging` before opening a PR into `test`. Scan results from `test` are not uploaded to the Security tab, so `test` has no alert state of its own. It can only catch new findings, by comparing against `staging`.

### What counts as a new finding

| Tool | A finding is new when | Compared against, PR into `staging` | Compared against, PR into `test` today | Needed for `test` to match `staging` |
|------|-----------------------|-------------------------------------|----------------------------------------|--------------------------------------|
| Semgrep | It is on a line the PR changed since the merge base. | `staging`'s tip. | `test`'s tip, so it scores only the PR's own change, which is what the later `staging` PR will see. Pointing at `staging` would instead report other developers' unpromoted code. | Nothing, once the gates are required on `test`. If blocked, see [If your PR is blocked by Semgrep](../sast-scanning.md#if-your-pr-is-blocked-by-semgrep). |
| Checkov | It is not in the directory's `.checkov.baseline`. Only the four hard-fail checks block. | The baseline file on the PR's branch. | Same. | Nothing. Fix the hard-fail checks rather than skipping them, and fix other findings your change adds too. |
| CodeQL | The alert is not already open on `staging`. The `staging` code-scanning rule blocks new high-or-higher alerts. | Alert state on `staging`. | Nothing. The job only has to complete, and its results aren't uploaded, so read the job log and fix what it reports rather than leaving it for the `staging` PR. | A decision: leave ungated, or add a step that diffs the local SARIF against `staging`'s alerts. |
| ShellCheck | Any error-level finding. There is no baseline. | n/a | n/a | Nothing. Don't add paths to `.shellcheckignore`: nothing reads it. |
| Gitleaks | It is in a commit that belongs to the PR and is not in `.gitleaksignore` or `.gitleaks.toml`. | The PR's own commits. | Same: `base.sha..head.sha`, with `base.sha` being `test`'s tip. A merge of `staging` into the branch also falls in the range. Those commits already passed the `staging` gate. | Nothing. A false positive goes in `.gitleaksignore` in a separate PR with the approver's sign-off ([Secrets scanning](../secrets-scanning.md#2-pr-ci-gate-blocking)). |
| Dependency Review | A manifest change adds a vulnerable dependency. Warn-only. | The base branch's manifests. | `test`'s manifests. | Nothing for now, since it does not block. |
| Trivy `fs` (`Findings vs staging`) | The rule, package and file combination is not in a Trivy scan of `staging` made in the same job. HIGH, CRITICAL and UNKNOWN, vulnerabilities only. | `staging`, scanned on every run. | Same, but the scan merges the PR into `test`, so another branch's unpromoted finding can show as new on yours. | Decided: require the check on `test` (item 2 below). |

Trivy `config`, Trivy `image`, npm audit, lockfile-lint and ZAP have no comparison. They report everything on every run.

### Required for `test` to catch new findings

`test` requires approvals and the functional checks today, and no security check. To block PRs on new findings without uploading anything:

1. Require `Security Gate (SAST)` and `Security Gate (Secrets)` on `test`, as on `staging`.
2. Require `Findings vs staging` on `test`, so new Trivy `fs` findings block there too. This is decided. A person reads the result, so the developer fixes what their branch caused and logs what it didn't ([Findings on pull requests](playbook.md#findings-on-pull-requests)).
3. Decide how CodeQL behaves on `test`, as described above.
4. Resolve the docs-only case. These workflows skip docs-only PRs with `paths-ignore`, and a required check that is skipped stays pending, so a docs-only PR cannot merge. Remove `paths-ignore` from the gate workflows, or add a gate that always reports a status.

None of these changes have been made. Each is a ruleset or workflow edit for a follow-up ticket.

### Background scans

Some scans are not required checks. They exist to catch vulnerabilities published after the code merged, and to get them logged early.

**Trivy `fs`** is not in this group. It is a required check on `test`, so a person reads its result before the merge. Auto-logging it was considered and dropped: a developer can tell which findings their branch caused, and an automatic log can't.

**Container scans** (`security-containers.yml`) run on every non-draft PR, including PRs into `test`, as well as weekly and when a Dockerfile changes. They are not required and don't block a merge. Instead, their findings are logged automatically as Jira tickets (a proposal; nothing is built yet):

1. **Collect.** After `trivy-image` runs, read its findings (the SARIF already produced) at or above the severity the playbook tracks. Each finding is a CVE ID, a package and an image.
2. **Match on the CVE ID.** The same CVE in a different package or a different image belongs in the same ticket, because one upstream fix or one rebuild often closes them together. Each ticket carries a Jira label per CVE, such as `cve-2024-1234`, and a table of the packages and images affected. The job finds open tickets with a JQL search (`project = <key> AND labels = cve-2024-1234 AND statusCategory != Done`), one CVE at a time or in a batch.
3. **If a CVE is already in an open ticket,** add the new package or image as a comment on that ticket, and say which run saw it. If that package and image are already listed, add nothing.
4. **If a CVE is in no open ticket,** group it with the other new CVEs from the same image and fix, and create one ticket for them. That keeps the playbook's [one ticket per fix, not per alert](playbook.md#ownership): a base-image upgrade that closes 40 CVEs is one ticket, not 40. The ticket uses the [title format](playbook.md#ownership), the severity and clock line, the labels and the table.
5. **If one run's CVEs already sit in different open tickets,** each CVE goes where it is. Merging tickets is a person's decision.

Two CVEs from one image can end up in separate tickets this way, when one was logged earlier by another image. That is intended: the earlier ticket already has an owner and a due date.

Things to settle before building it:
- **How it talks to Jira.** There is no `gh`-style CLI in the runner. The job calls the Jira Cloud REST API (`POST /rest/api/3/search/jql`, `POST /rest/api/3/issue`, `POST /rest/api/3/issue/{key}/comment`) with `curl`, or uses Atlassian's own CLI if the court allows it. Either needs a service-account API token stored as a repository secret, a project key, and an issue type. Whether the court's Jira is Cloud or Data Center changes the endpoints. All of this is unverified.
- **Where it runs.** Secrets are not passed to workflows triggered by a PR from a fork, so tickets can come only from PRs on branches in this repository, plus the weekly and `staging` runs. The weekly run is the reliable source; the PR runs add speed.
- **Duplicates.** Two PR runs at once can both find a CVE in no ticket and both create one. Serialize the logging step with a `concurrency` group that doesn't cancel.
- **What the ticket may say.** Jira is not public, so a ticket can carry more than a GitHub issue could. Whether the container findings can then all go in Jira, including ones the playbook now calls sensitive, is a decision for the approver. Until it is made, the job logs only routine findings and leaves the rest to a person.
- **Closing.** When a rebuilt image no longer has the CVEs, the ticket is closed by a person after checking the fix is deployed, as the playbook's [definition of resolved](playbook.md#what-counts-as-resolved) requires.

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
| A PR adds a suppression or baseline entry: `nosemgrep`, `#checkov:skip`, `shellcheck disable`, `.checkov.baseline`, `.gitleaksignore`, `.gitleaks.toml`, `.zap/rules.tsv`, `allow-ghsas` | A reviewer noticing it. | Nothing enforces the approver's sign-off. |
| A PR widens what the scans skip: `--exclude` or `--skip-check` in `security-sast.yml`, `paths-ignore` in a workflow or in `.github/codeql/codeql-config.yml` | Same. | Same. |
| An alert is dismissed in the Security tab | Write access to the repository. | Dismissals are not reviewed anywhere in code. |
| A commit reaches `prod` without passing through `staging` | Nothing in the security checks. `prod` requires only the functional checks, and no security workflow runs on a `prod` push. | A commit made directly on `prod` is never scanned. |
| A suppression merges to `test` and the same branch is then refused at `staging` | Nothing. | `test` then carries an acceptance that `staging` has not made. |

Proposed:
1. **Require the approver's review on the suppression files** with a path-scoped entry in the `required_reviewers` of the `test` and `staging` rulesets, covering the suppression files, `security-*.yml`, `.github/codeql/` and `.zap/`. A listed path is the only thing that then needs the approver's review, so the playbook's sign-off rule becomes enforced rather than asked for. The `staging` ruleset already requires reviewers by team, so this extends a rule that exists.
2. **Treat `staging` as the only source for `prod`.** Promotion is a merge of `staging` into `prod` by the court's operations staff ([pr-workflow.md](../../pr-workflow.md)), so a promotion adds nothing `staging` has not accepted. To make that provable, require the two security gates on `prod` as well. They would pass on a clean promotion.
3. **Review suppressions on `test` once.** The approver signs off on the `test` PR, as in [Remediating or accepting a failure](#remediating-or-accepting-a-failure). The `staging` PR for the same branch is then judged only by the gates. A suppression that is refused at `staging` is removed from `test` by reverting that branch.
4. **List dismissals in the weekly triage.** Add `state=dismissed` alerts since the last triage to [weekly-triage.md](weekly-triage.md), so every dismissal has a record and a review date.

## Emergency security fixes

There is no documented hotfix path today. The [playbook](playbook.md#same-day-triage) already defines what counts as an emergency: a possible secret, a KEV-listed or publicly exploited vulnerability in T1 or T2, or a finding reported by a person. This section covers how the fix then reaches `staging` and `prod`. It is a proposal.

**The gates are not bypassed.** No ruleset has a bypass actor, and the gates fail only on findings the PR adds, so a fix that removes one passes them.

1. **Triage the same day.** Follow [Same-day triage](playbook.md#same-day-triage). The approver opens the draft advisory and is told directly. For a secret, rotate first ([Secrets](playbook.md#secrets)); the code change is the clean-up, not the fix.
2. **Branch from `staging`** and change only what the fix needs. Open the PR into `staging`. `test` may be skipped when the approver agrees on the PR, because `test` is a dry run for the same gates. Skipping it also skips the product owner's check in the `test` environment.
3. **If the fix trips a gate,** fix that finding. If it cannot be fixed, the approver signs off on the PR the same day, the suppression goes on the branch, and the ticket is logged before merge. An emergency shortens the wait for sign-off, not what is recorded. See [Remediating or accepting a failure](#remediating-or-accepting-a-failure).
4. **Ask for the earlier deploy** as soon as the PR merges. [Deploys follow the court's schedule](playbook.md#what-counts-as-resolved), and the playbook already has the owner ask the court for an earlier one for a Critical or High finding in T1. Court operations merge `staging` into `prod`.
5. **Back-merge `staging` into `test`** afterwards so `test` carries the fix.

Decisions needed:
- **An out-of-band deploy ships everything on `staging`,** including work that was waiting for the next window. If that is not acceptable, the alternative is a branch from `prod` with a PR back into `prod`, then a merge into `staging`. That path would run no security checks on `prod` unless item 2 under [Protecting the baseline](#protecting-the-baseline) is done, and `pr-workflow.md` says Gunnison developers never touch `prod`.
- **Whether skipping `test` is allowed at all.** `pr-workflow.md` has the product owner verify on `test`, or on an experimental environment.

## Remediating or accepting a failure

The policy is in the [playbook](playbook.md#findings-on-pull-requests). This section adds only what the baseline strategy changes: the suppression is committed on the developer's own branch, and the scan must then stay quiet for later PRs.

1. **Fix it in the PR.** See [Fix it in the PR that caused it](playbook.md#fix-it-in-the-pr-that-caused-it).
2. **If it cannot be fixed,** log the ticket, get the approver's sign-off, and record the decision in the [exception record](playbook.md#the-exception-record). The playbook's order is remove, patch, upgrade, suppress, then accept.
3. **Commit the suppression on your branch,** after the ticket exists, in the form the tool reads. Put the Jira ticket key in the suppression's reason. For a sensitive finding, use the GHSA ID instead and keep the reasoning in the advisory ([Suppressing a finding](playbook.md#suppressing-a-finding)).
4. **Re-run the checks.** For the tools marked "Yes" below, later PRs into `test` and `staging` then do not report the same finding at the same place.

How to write the suppression for each scanner is in [scanner-reference.md](scanner-reference.md#suppression-mechanisms). This table covers only what the baseline strategy adds: whether the scan stays quiet for later PRs once the suppression is on your branch, and what is missing.

| Tool | Quiet on later PRs? | Gap |
|------|---------------------|-----|
| Semgrep | Yes. The `nosemgrep` comment travels with the line. | None. |
| Checkov | Yes. | The four hard-fail checks should be fixed, not skipped. How to regenerate a `.checkov.baseline` is undocumented. |
| CodeQL | No on `staging`: a new alert stays open until dismissed in the Security tab, and the `staging` rule blocks on it. On `test` nothing is gated yet. No suppression comment is verified. | A decision, below. |
| ShellCheck | Yes. The `shellcheck disable` comment travels with the line. | None. |
| Gitleaks | Yes, once `.gitleaksignore` is on the branch the PR is compared with. It goes in a separate PR, after rotation if the secret was real. | None. |
| Dependency Review | Not applicable while `warn-only`. | None until it blocks. |
| Trivy `fs` | No. There is no suppression, so the check keeps flagging the finding until it reaches `staging`. | See below. |
| Trivy `image`, `config`, ZAP | Nothing blocks on these today. | None until they block. |

**Trivy `fs` needs an ignore file to meet the goal.** `aquasecurity/trivy-action@v0.36.0` takes a `trivyignores` input, a list of `.trivyignore` files or one `.trivyignore.yaml`. Both formats can expire an entry on the playbook's review date. The plain `.trivyignore` takes an `exp:` date after the ID, as in `CVE-2022-1234 exp:2026-12-31`, and matches by ID only, so the ticket and reason go in a comment above the entry. The YAML form has `id`, `paths`, `purls`, `expired_at` and `statement` fields, so an entry can also name the location and carry the ticket. Trivy's own docs mark `.trivyignore.yaml` experimental, so prefer the plain file unless scoping by path is needed. Passing the file to the branch scan in `security-compare.yml` makes that finding stop being "new". Leaving it off the `trivy` job that uploads from `staging` keeps the alert open in the Security tab as the record. Confirm the chosen format works with the pinned `trivy-action` version before relying on it.

**VEX does not do this job.** No workflow passes `--vex`, `trivy-action@v0.36.0` has no VEX input, and Trivy applies only `not_affected` and `fixed` statements. An accepted finding is `affected`, so a VEX file cannot silence it. The playbook also keeps `affected` statements for T1 and T2 out of the public file.

**CodeQL is undecided.** The options are: leave `test` ungated; add a gate step that diffs the local SARIF against `staging`'s open alerts; or an inline `// codeql[<rule-id>]` suppression comment. The syntax and whether our config reads it are unverified. Excluding a rule in `.github/codeql/codeql-config.yml` is not an option: the config is shared with the `staging` uploads, so it would close the `staging` alert as well.

## npm audit and Trivy fs

**Compares against:** nothing, except Dependency Review (changed dependencies, high and above) and `Findings vs staging` (new Trivy fs findings not on `staging`, matched by CVE, package and file).

These don't block your PR, so a green check doesn't mean you added nothing. If your PR changes `package.json` or the lockfile, check the Dependency Review and `Findings vs staging` summaries, and take the fix by updating the dependency ([Patching npm dependencies](playbook.md#patching-npm-dependencies)). If you can't, defer it as described in [When a fix can be deferred](playbook.md#when-a-fix-can-be-deferred).
