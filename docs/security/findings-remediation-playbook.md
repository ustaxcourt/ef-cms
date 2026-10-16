# Security Findings Remediation Playbook

This playbook is what to do when a security scanner, or a person, reports a finding against
DAWSON: who owns it, how severe it is, how fast it gets fixed, and how a decision to suppress or
accept it is recorded. How each scanner works is covered in its own doc under `docs/security/`;
this doc is the process that sits on top of them.

On triage this week? Start at [Weekly triage](#weekly-triage).

## Purpose and scope

- **Audience:** the DAWSON team.
- **Status:** the severity rubric and remediation SLAs in this doc are a team agreement.
- **Covers:** every finding from the scanners listed under [Scanner inventory](#scanner-inventory),
  plus findings reported by people (pen tests, the ISSO, outside reports).
- **Does not cover:** how to configure or run a scanner. Where a scanner doc and this playbook
  disagree on process (who approves, how long a fix may take, how an exception is recorded), this
  playbook wins.

## Where findings are tracked

The repository and its GitHub Issues are public. Every finding is tracked as a GitHub issue on
the [ZenHub](../zenhub.md) board, so all security work shows up in one place with an assignee and
a due date. What the issue is allowed to say depends on whether the finding is sensitive.

| Finding | Tracking | What the public issue contains |
| --- | --- | --- |
| **Routine:** dependency and base-image upgrades, T3 findings, false positives, findings marked not affected | GitHub issue only | The full details |
| **Sensitive:** an unfixed finding that affects T1 or T2, any exposed secret, any finding reported by a person | Draft security advisory for the details, plus a GitHub issue that points to it | Only "Private security finding", the advisory's GHSA ID, the assignee and the due date. No component, severity or CVE. |

When in doubt, treat a finding as sensitive. Never put details of an unfixed T1 or T2
vulnerability in a public issue, PR description or commit message.

**Draft security advisories** live under Security → Advisories. Only repository owners, admins and
security managers can create one; everyone else can see and edit it only after being added to it
as a collaborator
([permission levels](https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/permission-levels-for-repository-security-advisories)).
If the triager does not have one of those roles, the approver creates the advisory and adds the
triager and the finding owner. Once the fix is in production, close the advisory, or publish it
if the team decides to.

## Roles

| Role | Who | Responsibilities |
| --- | --- | --- |
| Triager | The engineer on the weekly rotation (see [Dependency Updates](../dependency-updates.md)) | Reviews new findings each Monday, dedupes them, sets severity, opens or updates tracking records |
| Finding owner | The assignee of the tracking record | Fixes, suppresses or proposes accepting the finding, and validates the result |
| Approver | The tech lead, or a delegate the tech lead has named in advance | Approves every suppression and risk acceptance, at every severity |
| Team | Everyone on DAWSON | Kept informed through the weekly report; consulted on escalations |

When a delegate approves, the tracking record names the delegate, and the tech lead re-confirms
the decision on return.

## Exposure tiers

Severity depends on where a vulnerable component actually runs. Assign every finding to one of
these tiers.

### T1: production runtime

Code and packages that run in a deployed DAWSON environment.

- **Lambda functions and their production npm dependencies.** Lambdas run on the AWS-managed
  `nodejs24.x` runtime (`web-api/terraform/modules/lambda/lambda.tf`), not on a DAWSON container
  image, so OS packages in DAWSON's images do not reach Lambda.
- **The Puppeteer Lambda layer.** CircleCI builds it by running
  `web-api/runtimes/puppeteer/build.sh`, which runs `npm ci --production` and zips the result.
  Its contents are the production dependencies in `web-api/runtimes/puppeteer/package.json`
  (`@sparticuz/chromium`, `pug`, `puppeteer-core`, `sass`).
- **The `docket-entry-zipper` batch image.** It runs on AWS Batch with Fargate
  (`web-api/terraform/modules/batch/batch.tf`) and is rebuilt with `--no-cache` on every deploy
  (`web-api/terraform/modules/batch/docker-image/deploy-to-ecr.sh`). Everything in it is runtime:
  - the `node:24.21.0` base image (full, not slim)
  - `awscli`, installed with `apt-get`
  - every package in its `package.json`, including devDependencies, because the Dockerfile runs
    `npm ci` without `--production`
  - `ts-node` and `typescript`, installed globally and outside any lockfile. The image starts with
    `ts-node`, so TypeScript is a runtime dependency here, not a build tool.
- **Deployed infrastructure** defined in `web-api/terraform`.

T1 deliberately does not split internet-facing code (the public API) from internal code (the
batch job). Both handle court data, and one tier keeps the rubric simple. If a finding can only be
reached from inside AWS, record that as evidence when deciding whether DAWSON is affected (see
[Severity rubric](#severity-rubric)), not as a lower tier.

### T2: CI/CD with deploy credentials

Anything that runs with access to AWS credentials or repository secrets.

- **`ef-cms-us-east-1`**, the CircleCI image. It is built from the root `Dockerfile`
  (`FROM cypress/browsers:...`) and pinned by tag in `.circleci/config.yml`
  (`efcms-docker-image`). It builds, tests and deploys DAWSON; it is not a Lambda base image.
  The container scans build a fresh image from `Dockerfile`, so a scan result can differ from the
  pinned tag CI actually runs. Check the tag before acting on a finding.
- **GitHub Actions workflows** in `.github/workflows` and `.github/actions`.
- **Secrets** of any kind.

### T3: development and test only

Never deployed, and holds no deploy credentials.

- **`efcms-local`** (`Dockerfile-local`, `FROM ef-cms-us-east-1`). Not scanned.
- **The Puppeteer `Dockerfile`** (`FROM node:24.21.0-slim`). It is used only by `build-local.sh`,
  which `web-api/terraform/bin/deploy-app-color.sh` runs only when `CIRCLE_BRANCH` is empty, that
  is, for deploys from a developer machine. The deployed layer is built by `build.sh` instead.
- **devDependencies** of the root project, and Cypress.
- **ZAP findings that only exist locally**, such as the local stack accepting unsigned JWTs
  (see [DAST Scanning](./dast-scanning.md)).

## Scanner inventory

Last verified against `staging` on 2026-10-16. Re-check this table whenever a
`.github/workflows/security-*.yml` file changes.

| Tool | Workflow and job | Runs on | Reports | Findings land in | Blocks a PR? |
| --- | --- | --- | --- | --- | --- |
| Trivy config | `security-containers.yml` / `trivy-config` | PR, manual | MEDIUM, HIGH, CRITICAL, UNKNOWN | Security tab: `trivy-config` | No |
| Trivy image (CI image) | `security-containers.yml` / `trivy-image` | PR that changes image paths, manual | HIGH, CRITICAL, UNKNOWN (OS and library) | Security tab: `trivy-image-base` | No |
| Trivy image (base images) | `security-containers.yml` / `trivy-runtime-base` | PR that changes image paths, manual | HIGH, CRITICAL, UNKNOWN | Security tab: `trivy-image-puppeteer`, `trivy-image-batch` | No |
| Trivy baseline | `security-containers.yml` / `trivy-baseline` | Push to staging that changes image paths, weekly | HIGH, CRITICAL, UNKNOWN | Security tab: `trivy-baseline-base`, `trivy-baseline-puppeteer`, `trivy-baseline-batch` | No |
| Trivy filesystem | `security-supply-chain.yml` / `trivy` | PR, push to staging | HIGH, CRITICAL, UNKNOWN | Security tab: `trivy` | No |
| npm audit | `security-supply-chain.yml` / `npm-audit` | PR | HIGH and above, production dependencies only | Job log | No |
| Dependency review | `security-supply-chain.yml` / `dependency-review` | PR | HIGH and above, changed dependencies only | Job log | No (`warn-only`) |
| Lockfile lint | `security-supply-chain.yml` / `lockfile-lint` | PR | Lockfile integrity | Job log | No |
| Semgrep | `security-sast.yml` / `semgrep` | PR, push to staging | Registry rule packs and `.semgrep/` rules | Security tab: `semgrep` | Yes, for findings the PR introduces |
| Checkov | `security-sast.yml` / `checkov` | PR, push to staging | Terraform misconfigurations | Security tab: `checkov` | Only for the checks listed in `--hard-fail-on` |
| CodeQL | `security-sast.yml` / `codeql` | PR, push to staging | Code-level vulnerabilities | Security tab: `/language:<language>` | No; fails only if the analysis itself fails |
| ShellCheck | `security-sast.yml` / `shellcheck` | PR | Errors only (`-S error`) | Job log | Yes |
| Gitleaks | `security-secrets.yml` / `gitleaks` | PR, commits in the PR only | Secrets | Security tab: `gitleaks` | Yes |
| Gitleaks baseline | `security-secrets.yml` / `gitleaks-baseline` | Push to staging | Secrets | Security tab: `gitleaks-baseline` | No |
| OWASP ZAP API | `security-dast.yml` / `dast-api` | PR | API issues, per user role | Run artifacts only (14–30 days); not the Security tab until #10496 | No |
| OWASP ZAP web | `security-dast.yml` / `dast-web` | Weekly, manual | Web app issues | Run artifact `zap-web-reports` (30 days); not the Security tab until #10496 | No |
| Findings vs staging | `security-compare.yml` / `compare` | PR | Trivy filesystem count, HIGH, CRITICAL, UNKNOWN | Job summary | Yes, if the PR has more findings than staging |

Things to know when reading this table:

- **SARIF reaches the Security tab** from every run except PRs, plus same-repository PRs into
  staging (`.github/actions/dawson-upload-sarif/action.yml`). Other PRs report findings only in
  the job log and summary.
- **Base-image scans see only the base.** The Puppeteer and batch scans check the image named in
  each Dockerfile's `FROM` line, not the built image. For batch, that means `awscli`, the global
  `ts-node` and `typescript`, and its npm packages are not covered by the container scan.
- **No scanner checks npm devDependencies.** npm audit runs with `--omit=dev`, and Trivy
  ["doesn't report development dependencies"](https://trivy.dev/latest/docs/coverage/language/nodejs/)
  unless `--include-dev-deps` is set, which no DAWSON workflow does. T3 npm packages, Cypress
  included, are therefore not reported today.
- **The weekly Monday 06:00 UTC run** (`cron: '0 6 * * 1'`) is currently set only on
  `security-containers.yml` and `security-dast.yml`. The other workflows refresh the Security tab
  on every push to staging.
- **CI never forces a fix of an existing finding.** The blocking checks above stop new problems
  from merging; everything already in the Security tab is driven by the SLAs in this playbook.

## Severity rubric

Every finding gets one DAWSON severity: Critical, High, Medium or Low. The SLA clock runs on that
severity, not on the scanner's. Work it out in three steps.

### 1. Start from the scanner's severity

| Scanner | Base severity |
| --- | --- |
| Trivy, npm audit, dependency review | The severity the scanner reports (CVSS or GitHub advisory rating). UNKNOWN counts as High until someone rates it. |
| CodeQL | The alert's security severity: 9.0 and above Critical, 7.0–8.9 High, 4.0–6.9 Medium, below 4.0 Low |
| Semgrep | ERROR is High, WARNING is Medium, INFO is Low |
| Checkov | Checkov does not report a severity. Checks in `--hard-fail-on` are High; every other check is Medium. |
| Gitleaks | Critical, until the finding is confirmed to be a false positive |
| OWASP ZAP | High, Medium and Low map directly. Informational alerts are not tracked. |
| ShellCheck, lockfile lint | Not tracked. They block the PR that introduces them and are fixed there. |

Treat findings that share a CVE and a cause as one finding. For example, one CVE reported against
both `zlib1g` and `zlib1g-dev`, or against the same base image under several categories, is a
single finding, assigned to the most exposed tier it appears in.

### 2. Check whether DAWSON is affected at all

**Shortcut: if a routine fix exists, skip this step.** When a fixed version is available and
taking it is a normal upgrade (a patch or minor bump, or a newer base-image tag), treat the
finding as affected and fix it. Proving it does not apply would take longer than the upgrade.
Analyze only findings with no fix, or where the fix is a breaking change.

Otherwise, if there is evidence that the finding does not apply, mark it **not affected** with
one of these justifications, and handle it through the suppression process instead of an SLA:

- `component_not_present`: the vulnerable package is not in what DAWSON deploys or runs
- `vulnerable_code_not_present`: the package is present, but not the vulnerable version or code
- `vulnerable_code_not_in_execute_path`: the vulnerable code is present but DAWSON never calls it
- `vulnerable_code_cannot_be_controlled_by_adversary`: DAWSON calls it, but never with input an
  attacker can influence
- `inline_mitigations_already_exist`: a control already in place blocks the attack

These are the "not affected" justifications from the VEX standard, so the reasoning recorded now
can become a VEX statement later.

Evidence is something a reviewer can re-run or open and reach the same conclusion: a command and
its output, or a code reference. It must show that the *vulnerable code* is absent or
unreachable. Showing only that a package is present, or that DAWSON uses a different library,
is not enough. "It's probably fine" is not evidence.

For container findings, the method for deciding whether a package is present and reachable is in
the container findings triage guide (PR #10521).

### 3. Apply the modifiers

Apply these in order to anything that is affected:

1. **Raise to Critical** if the vulnerability is on the
   [CISA Known Exploited Vulnerabilities catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog),
   or has a public exploit, and the component is in T1 or T2. A public exploit means the CVE's
   GitHub advisory or NVD entry links to working exploit code or a proof of concept. A
   theoretical description of the attack does not count.
2. **Any exposed secret is Critical.** No modifier lowers it.
3. **Lower one level for T3** (dev and test only), with Low as the floor.

Nothing else changes the severity. A finding in T1 or T2 is never lowered just because it is
hard to fix or has no patch; that is handled by the exception process, which records the risk
instead of hiding it.

### Worked examples

**A Critical zlib CVE with no fix, in the batch image (T1).** Under `trivy-baseline-batch`,
Trivy reports CVE-2023-45853 as Critical, twice: once against `zlib1g` and once against
`zlib1g-dev` (both `1:1.2.13.dfsg-1`, from the `node:24.21.0` base). There is no fixed version.

1. Dedupe: same CVE, same cause. This is one finding, in T1.
2. Base severity: Critical.
3. Shortcut? No fix exists, so analyze it.
4. Affected? CVE-2023-45853 is in MiniZip, a separate part of the zlib source tree. Debian's
   `zlib1g` and `zlib1g-dev` packages do not include it. This command lists every file the two
   packages install and finds no MiniZip file (`grep` exits 1, meaning no match):

   ```sh
   docker run --rm --platform linux/amd64 node:24.21.0 \
     sh -c 'dpkg -L zlib1g zlib1g-dev | grep -i minizip'
   ```

5. Result: **not affected** (`vulnerable_code_not_present`). No SLA; it goes through the
   suppression process, with the command and its empty output as the evidence. Re-check it
   whenever the base image changes, because a new base could add a MiniZip package.

Note what is *not* used as evidence: the batch job builds zip files with `fflate`, a JavaScript
library, instead of zlib. That is true, but it shows only what the job's own code calls. Other
programs in the image, such as `awscli`, could still use zlib. The `dpkg` output settles it.

**Perl CVEs fixed in Debian but not yet in the image, in the Puppeteer base (T3).** Under
`trivy-baseline-puppeteer`, Trivy reports seven CVEs (three Critical, four High) against
`perl-base 5.36.0-7+deb12u3` in `node:24.21.0-slim`. All seven are fixed in `5.36.0-7+deb12u4`.

1. Dedupe: same package, same fix. This is one finding: get `perl-base` to `deb12u4`.
2. Base severity: Critical, the highest in the group.
3. Shortcut? Yes. A fix exists, so treat it as affected and do not spend time proving otherwise.
4. Modifiers: the image is T3. Only `build-local.sh` uses it; the deployed layer is built by
   `build.sh` without this image. Lower one level.
5. Result: **High**, due in 30 days, tracked as a routine public issue because it is T3.

Checking where the fix is matters before anyone opens a PR:

```sh
docker run --rm --platform linux/amd64 node:24.21.0-slim \
  sh -c 'apt-get update -qq && apt-cache policy perl-base'
```

On 2026-10-16 this showed `deb12u4` in Debian's `bookworm-security` repository, while
`node:24.21.0-slim` and the newest `node:24-slim` both still shipped `deb12u3`. So the fix is
to bump the `FROM` tag once a `node` slim image includes `deb12u4`. Adding `apt-get upgrade` to
the Dockerfile would not clear the alert, because this scan reads the image on the `FROM` line,
not the built image (see [Scanner inventory](#scanner-inventory)). If no such tag ships before the
due date, the finding goes to the approver as a wait-for-upstream exception.

Had there been no fix at all, the affected check would have looked at each CVE's vulnerable code.
The slim image ships `perl-base` but not `perl-modules-5.36`, so a CVE in a module from that
package (for example `Archive::Tar`) would be `component_not_present`. The presence of
`perl-base` alone answers nothing either way.

## Remediation SLAs

| DAWSON severity | Resolve within |
| --- | --- |
| Critical | 15 days |
| High | 30 days |
| Medium | 90 days |
| Low | 180 days |
| Exposed secret | Revoked or rotated within 1 business day; the rest of the clean-up follows the Critical SLA |

All periods are calendar days, except the business day for secrets.

### What counts as resolved

The SLA is met when one of these happens:

- **Fixed:** the fix is merged to `staging` and the next scan no longer reports the finding.
- **Not affected:** the finding is marked not affected, with evidence, and the approver agrees.
- **Accepted:** the approver has signed off on an exception.

The SLA stops at the merge to `staging` because that is the last step the team controls.
Production deploys follow the court's release schedule. For a **Critical or High finding in
T1**, the finding is not closed until the fix is running in production. If the next production
deploy is more than 15 days after the merge, the finding owner asks the court for an earlier
deploy.

### When the clock starts

- **New findings:** on the date a scan first reports them. For Security-tab findings this is the
  alert's created date; for ZAP it is the date of the run artifact; for a finding reported by a
  person it is the date it was reported.
- **Existing backlog:** findings already open when this playbook is adopted get a 30-day clean-up
  window first, for deduplicating and retiring alerts from scans that no longer run. Their clocks
  then start in two waves, so the whole backlog does not fall due at once:
  - Critical and High: when the clean-up window ends
  - Medium and Low: 60 days after the clean-up window ends
- **Adoption date:** recorded here when this playbook merges.

### Missing an SLA

A finding that is about to miss its SLA goes to the approver before the due date, not after. The
approver either agrees a new date with the finding owner, or the owner raises an exception. A
missed SLA is never left open silently; it appears in the weekly report until it is resolved.

The SLAs apply to findings that already exist. New code is held to a stricter standard: it must
not add medium- or high-severity findings at all ([Code Review](../code-review.md)).

## Weekly triage

Every Monday, after the 06:00 UTC scheduled runs, the triager works through this list. Run the
commands from a clone of the repository with the `gh` CLI signed in. None of them change your
working tree.

1. **Start a fresh container scan.** `trivy-config` runs only on PRs and manual runs, so its
   results on `staging` go stale unless someone runs it. The run takes several minutes, so start
   it first and let it finish while you do steps 2 to 4.

   ```sh
   gh workflow run security-containers.yml --ref staging
   sleep 10
   RUN_ID=$(gh run list --workflow security-containers.yml --event workflow_dispatch \
     --user "$(gh api user -q .login)" --limit 1 --json databaseId -q '.[0].databaseId')
   ```

2. **Check that the scheduled runs worked.** A failed run shows up as no new findings, which
   looks the same as a good week.

   ```sh
   gh run list --workflow security-containers.yml --event schedule --limit 1
   gh run list --workflow security-dast.yml --event schedule --limit 1
   ```

   If either one failed, rerun its failed jobs with `gh run rerun <run-id> --failed`, and note in
   the weekly report that its results are missing until the rerun passes.

3. **Read the ZAP web report** from the latest scheduled run. ZAP results do not reach the
   Security tab yet; [#10496](https://github.com/ustaxcourt/ef-cms/issues/10496) adds that.
   Until it lands, this manual review is how ZAP findings get triaged. Afterwards, drop this step
   and add the new `zap-*` categories to [Which categories to triage](#which-categories-to-triage).

   ```sh
   ZAP_RUN=$(gh run list --workflow security-dast.yml --event schedule --limit 1 \
     --json databaseId -q '.[0].databaseId')
   gh run download "$ZAP_RUN" -n zap-web-reports -D "$(mktemp -d)"
   ```

4. **Audit the npm lockfiles on `staging`.** In CI, npm audit runs only on PRs and only checks the
   root lockfile. This checks all three lockfiles that ship, from a temporary directory:

   ```sh
   git fetch -q origin staging
   AUDIT_DIR=$(mktemp -d)
   for p in . web-api/runtimes/puppeteer web-api/terraform/modules/batch/docker-image; do
     mkdir -p "$AUDIT_DIR/$p"
     git show "origin/staging:$p/package.json" > "$AUDIT_DIR/$p/package.json"
     git show "origin/staging:$p/package-lock.json" > "$AUDIT_DIR/$p/package-lock.json"
     echo "== $p" && (cd "$AUDIT_DIR/$p" && npm audit --omit=dev --audit-level=high)
   done
   ```

   A finding that is already tracked, such as the moderate `quill` advisory, needs no new record.

5. **Wait for the container scan from step 1 to finish:**

   ```sh
   gh run watch "$RUN_ID" --exit-status
   ```

6. **List the Security-tab alerts opened since the last triage.** Set `SINCE` to the date of the
   last completed triage, not last Monday, so a skipped week is not lost. The query keeps only
   the categories that are triaged:

   ```sh
   SINCE=2026-10-12
   gh api --paginate \
     "repos/ustaxcourt/ef-cms/code-scanning/alerts?state=open&ref=refs/heads/staging&per_page=100" \
     --jq '.[] | select(.created_at >= "'"$SINCE"'")
           | select(.most_recent_instance.category
               | test("^(trivy-baseline-(base|puppeteer|batch)|trivy|trivy-config|semgrep|checkov|/language:.*|gitleaks-baseline)$"))
           | [.created_at[:10], .most_recent_instance.category, .rule.id, .html_url] | @tsv'
   ```

7. **Triage each new finding:** dedupe it, assign a tier, work out its severity
   ([Severity rubric](#severity-rubric)), and open or update its tracking record
   ([Where findings are tracked](#where-findings-are-tracked)).
8. **Check what is due.** List open security findings and raise any due within 14 days, or
   already past due, with the approver (see [Missing an SLA](#missing-an-sla)):

   ```sh
   gh issue list --repo ustaxcourt/ef-cms --state open --search 'in:title "Security finding"' \
     --limit 200
   ```

9. **Record the date** of this triage in the weekly report. It is the next triage's `SINCE`.

### Which categories to triage

On `staging`, some Security-tab categories hold current results and some only hold old or
duplicate ones. The query in step 6 already applies this table.

| Category | Updated on `staging` by | Triage? |
| --- | --- | --- |
| `trivy-baseline-base`, `trivy-baseline-puppeteer`, `trivy-baseline-batch` | Weekly run, and pushes that change image paths | Yes |
| `trivy` | Every push | Yes |
| `semgrep`, `checkov`, `/language:javascript-typescript` | Every push | Yes |
| `gitleaks-baseline` | Every push | Yes, the same day (see [Same-day triage](#same-day-triage)) |
| `trivy-config` | Manual runs (step 1) | Yes |
| `trivy-image-base`, `trivy-image-puppeteer`, `trivy-image-batch` | Manual runs (step 1) | No: duplicates by design. They scan the same images as `trivy-baseline-*`, and step 1 refreshes them every week, so they stay open. Leave them out of every count, report and SLA. |
| `trivy-baseline-local`, `trivy-image-local` | Nothing. The `efcms-local` scan was removed. | No. Retire them (see [Backlog clean-up](#backlog-clean-up)). |

This table decides the size of the backlog. On 2026-10-16, 12,292 of the open alerts on
`staging` came from Trivy, but only 1,084 of those were in triaged categories. The rest were
7,002 `trivy-image-*` duplicates and 4,206 alerts in the retired `efcms-local` categories.

### Same-day triage

Do not wait for Monday when any of these happens. Tell the approver directly the same business
day. The approver opens a draft security advisory (see
[Where findings are tracked](#where-findings-are-tracked)).

- **A possible secret.** Gitleaks blocks a PR, `gitleaks-baseline` opens an alert, or anyone
  spots a credential in the code, a log or an issue. Treat it as exposed until proven otherwise.
  A secret is exposed the moment it is pushed to any branch of this public repository, whether
  or not the PR is ever merged, so rotation comes first, before the history is cleaned up.
- **A KEV-listed or publicly exploited vulnerability in T1 or T2**, however it comes to light: a
  scan, an advisory, or the news.
- **A finding reported by a person.**

### Findings reported by people

Pen-test results, ISSO reports and outside reports go straight to the approver, who opens a draft
security advisory and adds the reporter's details there, never in a public issue. The SLA clock
starts on the date of the report. They go through the same rubric as scanner findings, with the
reporter's evidence in place of a scan result.

The repository has no `SECURITY.md`, so an outside reporter has no published way to reach the
team. Anyone who receives a report informally forwards it to the approver.

### Backlog clean-up

The approver owns the 30-day clean-up window that starts on the adoption date (see
[When the clock starts](#when-the-clock-starts)) and makes sure both of these are done before it
ends.

**Retire what no longer means anything.** This needs write access to the repository.

- **The `efcms-local` categories.** `scripts/run-once-scripts/dismiss-duplicate-local-alerts.sh`
  dismisses the alerts that repeat the CI image's CVEs. Run it without arguments first to see
  what it would dismiss, then with `--apply`. It deliberately leaves alerts under real file paths,
  which come from that image's `npm ci` layer and appear in no other category. Triage those like
  any other finding.
- **Categories retired later.** Either dismiss their alerts, or have a repository admin
  [delete the category's analyses](https://docs.github.com/en/rest/code-scanning/code-scanning#delete-a-code-scanning-analysis-from-a-repository).
  Removing a scan never closes the alerts it already reported.

Dismissing an alert hides it for good, so dismiss only confirmed duplicates and alerts from scans
that no longer run. Everything else goes through the rubric.

**Triage the open alerts in triaged categories.** The weekly routine only picks up new alerts, so
the existing ones need one pass of their own. Run the step 6 query with `SINCE=2000-01-01`, then
group the results by the fix that would close them, not by CVE. Nearly all of the 1,084 Trivy
alerts come from three base images, so they collapse into a handful of base-image upgrades. Open one
tracking record per group. Their SLA clocks start in the two waves described in
[When the clock starts](#when-the-clock-starts).

### Ownership

- **One issue per fix, not per alert.** A base-image upgrade that closes 40 CVEs is one issue
  that lists them, not 40 issues.
- **A fixed title format**, so every open finding can be listed with one search (step 8):
  - routine: `Security finding: <what to fix> (due 2026-11-15)`
  - sensitive: `Security finding: GHSA-xxxx-xxxx-xxxx (due 2026-11-15)`

  The first line of the body gives the severity and when the clock started, for example
  `High, 30 days from 2026-10-16`. Sensitive issues leave that line out.
- **No bug-severity labels.** The `Critical Severity`, `High Severity` and similar labels measure
  impact on court users, as set by the product owner ([Story Life Cycle](../story-life-cycle.md)).
  They are a different scale from the security severity in this playbook.
- **Who picks it up.** The approver assigns Critical and High findings in T1 or T2 the same day.
  The triager raises everything else with the product owner, who schedules it like other work.
  If it cannot be scheduled before its due date, it goes to the approver as described in
  [Missing an SLA](#missing-an-sla).
