# Security Findings Remediation Playbook

This playbook is what to do when a security scanner, or a person, reports a finding against
DAWSON: who owns it, how severe it is, how fast it gets fixed, and how a decision to suppress or
accept it is recorded. How each scanner works is covered in its own doc under `docs/security/`;
this doc is the process that sits on top of them.

On triage this week? Use the [weekly triage runbook](weekly-triage.md). For scanner details,
suppression mechanisms and image rebuilds, see the [scanner reference](scanner-reference.md).

## Purpose and scope

- **Audience:** the DAWSON team.
- **Status:** the severity rubric and remediation SLAs in this doc are a team agreement.
- **Covers:** every finding from the scanners listed under [Scanner
  inventory](scanner-reference.md#scanner-inventory), plus findings reported by people (pen tests,
  the ISSO, outside reports).
- **Does not cover:** how to configure or run a scanner. Where a scanner doc and this playbook
  disagree on process (who approves, how long a fix may take, how an exception is recorded), this
  playbook wins.

## Where findings are tracked

The repository and its GitHub Issues are public. Every finding is tracked as a GitHub issue on
the [ZenHub](../../zenhub.md) board, so all security work shows up in one place with an assignee and
a due date. What the issue is allowed to say depends on whether the finding is sensitive.

| Finding | Tracking | What the public issue contains |
| --- | --- | --- |
| **Routine:** dependency and base-image upgrades, T3 findings, false positives, findings marked not affected | GitHub issue only | The full details |
| **Sensitive:** an unfixed finding that affects T1 or T2, any exposed secret, any finding reported by a person | Draft security advisory for the details, plus a GitHub issue that points to it | Only "Private security finding", the advisory's GHSA ID, the assignee and the due date. No component, severity or CVE. |

When in doubt, treat a finding as sensitive. Never put details of an unfixed T1 or T2
vulnerability in a public issue, PR description or commit message.

**Draft security advisories** live under Security → Advisories. Only repository owners, admins and
security managers can create one; everyone else can see and edit it only after being added to it as
a collaborator ([permission
levels](https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/permission-levels-for-repository-security-advisories)).
If the triager does not have one of those roles, the approver creates the advisory and adds the
triager and the finding owner. Once the fix is in production, close the advisory, or publish it if
the team decides to.

## Roles

| Role | Who | Responsibilities |
| --- | --- | --- |
| Triager | The engineer on the weekly rotation (see [Dependency Updates](../../dependency-updates.md)) | Reviews new findings each Monday, dedupes them, sets severity, opens or updates tracking records |
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
  (see [DAST Scanning](../dast-scanning.md)).

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

1. **Raise to Critical** if the vulnerability is on the [CISA Known Exploited Vulnerabilities
   catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog), or has a public exploit,
   and the component is in T1 or T2. A public exploit means the CVE's GitHub advisory or NVD entry
   links to working exploit code or a proof of concept. A theoretical description of the attack does
   not count.
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
`node:24.21.0-slim` and the newest `node:24-slim` both still shipped `deb12u3`. So the fix is to
bump the `FROM` tag once a `node` slim image includes `deb12u4`. Adding `apt-get upgrade` to the
Dockerfile would not clear the alert, because this scan reads the image on the `FROM` line, not the
built image (see [Scanner inventory](scanner-reference.md#scanner-inventory)). If no such tag ships
before the due date, the finding goes to the approver as a wait-for-upstream exception.

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
approver either agrees a new due date with the finding owner, or the owner proposes accepting the
risk. Both are recorded as [exceptions](#exceptions). A missed SLA is never left open silently;
it appears in the weekly report until it is resolved.

The SLAs apply to findings that already exist. New code is held to a stricter standard: it must
not add medium- or high-severity findings at all ([Code Review](../../code-review.md)).

## Intake and ownership

Most findings arrive through the [weekly triage](weekly-triage.md). These rules cover what does
not wait for it, and who owns a finding once it is tracked.

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

### Ownership

- **One issue per fix, not per alert.** A base-image upgrade that closes 40 CVEs is one issue
  that lists them, not 40 issues.
- **A fixed title format**, so every open finding can be listed with one search (step 8):
  - routine: `Security finding: <what to fix> (due 2026-11-15)`
  - sensitive: `Security finding: GHSA-xxxx-xxxx-xxxx (due 2026-11-15)`
  - after an [exception](#exceptions): the same title with `(review 2027-01-15)` in place of the
    due date

  The first line of the body gives the severity and when the clock started, for example
  `High, 30 days from 2026-10-16`. Sensitive issues leave that line out.
- **No bug-severity labels.** The `Critical Severity`, `High Severity` and similar labels measure
  impact on court users, as set by the product owner ([Story Life
  Cycle](../../story-life-cycle.md)). They are a different scale from the security severity in this
  playbook.
- **Who picks it up.** The approver assigns Critical and High findings in T1 or T2 the same day.
  The triager raises everything else with the product owner, who schedules it like other work.
  If it cannot be scheduled before its due date, it goes to the approver as described in
  [Missing an SLA](#missing-an-sla).

## Choosing an action

Work down this list and take the first action that applies. Removing comes first because a
package DAWSON does not ship can never be vulnerable again. Suppressing and accepting are last,
because they leave the vulnerable code in place.

| Action | Use it when | How |
| --- | --- | --- |
| **Remove** | DAWSON does not need the package, or a slimmer base image would drop it | Delete the dependency or change the base image |
| **Patch** | A fixed version is within the range DAWSON already allows | [Patching npm dependencies](#patching-npm-dependencies), or a newer tag of the same base image |
| **Upgrade** | The fix needs a bigger change: a new major version, or a different base image | A normal PR, tested like any other dependency change |
| **Suppress** | DAWSON is not affected, or the finding is a false positive, with evidence ([Severity rubric](#severity-rubric)) | [Suppressing a finding](#suppressing-a-finding) |
| **Accept** | DAWSON is affected, and there is no fix or the fix cannot be done before the due date | Approver sign-off with a review date; see [No upstream fix](#no-upstream-fix) |

For findings in DAWSON's own code or configuration (Semgrep, CodeQL, Checkov, Trivy config and
ZAP), "patch" means changing that code or Terraform. The package and image guidance below is for
third-party dependencies.

Whatever the action, the finding is resolved only as described in
[What counts as resolved](#what-counts-as-resolved).

### Patching npm dependencies

DAWSON ships three separate npm projects, each with its own `package.json` and lockfile:

- the root project (Lambdas, API, web client)
- `web-api/runtimes/puppeteer` (the Puppeteer Lambda layer)
- `web-api/terraform/modules/batch/docker-image` (the batch job)

A fix in one does not reach the others. Patch the project the finding is in.

- **Direct dependency:** bump it in that project's `package.json`.
- **Transitive dependency:** if the parent package has a release that pulls in the fixed
  version, bump the parent. Otherwise, pin the fixed version under `overrides` in that project's
  `package.json`, as the root project already does for `shell-quote`. An override stays until
  someone removes it, so note in the PR when it can go (usually when the parent catches up).

Check the fix with the npm audit commands in [Weekly triage](weekly-triage.md) step 4.

### Suppressing a finding

Every suppression needs:

- **Approval.** For a suppression in a file, the approver approves the PR that adds it. For a
  dismissal in the Security tab, the approver agrees on the tracking record before anyone
  dismisses the alert.
- **A justification that names the tracking record.** Write the reason and the issue number or
  GHSA ID next to the suppression, so a reader can find the evidence.
- **A review date in the tracking record.** None of the suppression mechanisms expires on its own.

Suppression text is public: every suppression file is in this public repository, and a comment such
as "not encrypted because..." tells an attacker where to look. For a sensitive finding, the
suppression's justification is only the GHSA ID, for example `#checkov:skip=CKV_AWS_18:See
GHSA-xxxx-xxxx-xxxx`. The reasoning goes in the advisory.

Nothing enforces the approval yet: the repository has no `CODEOWNERS` file. Any reviewer who sees
a new suppression in a PR asks for the approver's review before approving it.

Suppressions that existed before this playbook, such as the inline Checkov skips, do not name a
tracking record. They stay as they are. Whoever next changes the file they are in checks that each
one still applies, and adds a tracking record or removes it.

How to suppress in each scanner, and how to dismiss an alert in the Security tab, is in
[Suppression mechanisms](scanner-reference.md#suppression-mechanisms).

### No upstream fix

When there is no fix to take, work through these in order and record the outcome in the tracking
record:

1. **Confirm there really is no fix.** Check the
   [Debian security tracker](https://security-tracker.debian.org/tracker/) for OS packages, or the
   advisory's patched versions for npm packages. Check `apt-cache policy <package>` inside the
   image, and whether a newer tag or the `-slim` variant of the base image has the fix.
2. **Remove the package if DAWSON does not need it.** Full Node images include many packages a
   slim image leaves out. For example, the batch image's `zlib1g-dev` and `libmagickwand-dev`
   come from the full `node:24.21.0` base, and
   [#10495](https://github.com/ustaxcourt/ef-cms/issues/10495) moves it to a slim base.
3. **Check whether DAWSON is affected,** using step 2 of the [Severity rubric](#severity-rubric).
   A finding that does not apply is suppressed, not accepted.
4. **Look for a compensating control** that blocks the attack without a fix: network rules,
   input validation, or turning off the vulnerable feature. A control that exists already makes
   the finding `inline_mitigations_already_exist`. One added for this finding is recorded with the
   acceptance.
5. **Accept the risk** with the approver's sign-off and a review date: no more than 90 days away
   for Critical or High, 180 days for Medium or Low, and sooner if a fix is expected. A Critical
   finding in T1 is also raised with the whole team.

Never accept a finding only because there is no patch. "No fix exists" is the reason to work
through this list, not the end of it.

For container findings, the full method for deciding whether a package is present and reachable
in an image is in the container findings triage guide (PR #10521).

## Exceptions

An exception is any decision that leaves a finding unfixed past its due date, or for good. There
are three kinds, and all three need the approver:

| Exception | When | VEX status |
| --- | --- | --- |
| **New due date** | The fix is known but cannot land before the due date | `affected` |
| **Accepted risk** | DAWSON is affected and there is no fix, or the fix is not worth doing yet ([No upstream fix](#no-upstream-fix)) | `affected` |
| **Not affected** | Evidence shows the finding does not apply ([Severity rubric](#severity-rubric), step 2) | `not_affected` |

Not affected counts as an exception because the alert stops being visible while the decision is
still a judgment that can go stale. A plain **false positive**, where the scanner is wrong about
the facts (for example a Gitleaks match on a made-up value in one commit), is different: it cannot
go stale, so it is recorded the same way but needs no review date.

### The exception record

Write the record in the finding's tracking record: the issue body for a routine finding, the draft
advisory for a sensitive one. Copy this template and fill in every line:

```markdown
### Exception
- Findings: <alert links, or CVE IDs and Security-tab categories>
- Component and tier: <package or image, and T1, T2 or T3>
- Severity: <DAWSON severity, from the rubric>
- Decision: <new due date | accepted risk | not affected>
- VEX: <status, and justification for not_affected>
- Evidence, or reason and plan: <for not affected, the check a reviewer can re-run; otherwise why it is not fixed and what will fix it>
- Compensating control: <what limits the risk meanwhile, or "none">
- Approved by: <approver> on <YYYY-MM-DD>
- Review by: <YYYY-MM-DD>
```

An approved accepted risk or not-affected decision meets the SLA (see
[What counts as resolved](#what-counts-as-resolved)), but its issue stays open while the
exception is in force, only to carry the review date. Its title shows `(review <date>)` (see
[Ownership](#ownership)), so the weekly triage lists it alongside findings that are due. Keep these
issues out of active work on the board. A false positive's issue is closed once it is recorded.

### Review dates

Every exception ends on its review date. The longest each kind may run:

| Exception | Longest review date |
| --- | --- |
| New due date | One SLA period from the original due date, granted once. A second extension is an accepted risk. |
| Accepted risk, Critical or High | 90 days |
| Accepted risk, Medium or Low | 180 days |
| Not affected | 12 months, or sooner when the component changes, such as a base-image bump or a new version of the package |

Set an earlier date when a fix is expected sooner. A not-affected decision is about a specific
version: when that version changes, the evidence has to be checked again, even if the scan does
not report anything new. A dismissed alert stays dismissed after the code under it changes.

### On the review date

What happens depends on the kind of exception.

**New due date.** The review date is the new due date. If the fix has not landed, the finding has
missed its SLA a second time and goes straight to the approver as an accepted-risk decision (see
[Missing an SLA](#missing-an-sla)). It never gets a second new due date.

**Accepted risk.** The finding owner checks whether a fix now exists, then either:

- **fixes it:** the finding goes back on an SLA, counted from the review date, or
- **renews it:** the approver signs off on a new review date, within the limits above, and the
  record gets the new date and the reason the risk still stands. A second renewal of a Critical or
  High finding is also raised with the whole team, so a 90-day acceptance does not quietly become
  permanent.

**Not affected.** The finding owner re-runs the evidence, then either:

- **renews it:** the evidence still holds, and the record gets the new review date, or
- **ends it:** the evidence no longer holds. Reopen the alert in the Security tab, or remove the
  suppression from its file, and the finding goes back on an SLA, counted from the review date.

An exception nobody reviews ends on its own. On the day after its review date it is treated as
ended, the finding is back on an SLA counted from the review date, and it shows as overdue in the
weekly report until someone acts.

## VEX statements

VEX (Vulnerability Exploitability eXchange) is a standard way to say, for one CVE in one product,
whether DAWSON is affected and why. CISA's [VEX use
cases](https://www.cisa.gov/sites/default/files/publications/VEX_Use_Cases_Document_508c.pdf)
explain it. This playbook uses VEX's words for its decisions, so every exception record can be
turned into a VEX statement later without redoing the analysis.

**Nothing is published as VEX yet.** DAWSON has no VEX file, and no scanner reads one. Publishing
VEX and wiring it into Trivy is a separate piece of work.

### How decisions map to VEX

| VEX status | In this playbook | Statement must also include |
| --- | --- | --- |
| `not_affected` | A not-affected exception | `justification`, one of the five in [Severity rubric](#severity-rubric) step 2 |
| `affected` | An open finding, a new due date, or an accepted risk | `action_statement`: the fix planned, or the compensating control |
| `fixed` | Resolved by a fix that is in the shipped component | — |
| `under_investigation` | Triaged, with the affected check still in progress | — |

### Example

The not-affected decision from the [worked examples](#worked-examples) (CVE-2023-45853 in the
batch image's zlib) as an [OpenVEX](https://github.com/openvex/spec) statement. The document `@id`
is an identifier, not a link, and the one here is made up:

```json
{
  "@context": "https://openvex.dev/ns/v0.2.0",
  "@id": "urn:dawson:vex:example-2026-001",
  "author": "DAWSON team",
  "timestamp": "2026-10-20T00:00:00Z",
  "version": 1,
  "statements": [
    {
      "vulnerability": { "name": "CVE-2023-45853" },
      "products": [
        {
          "@id": "pkg:oci/node@sha256:3d27e5c11e5786e309ec3e03f93ae536eb36e6e5eb3714d5eb3300a36157add0?arch=amd64&repository_url=index.docker.io%2Flibrary%2Fnode",
          "subcomponents": [
            { "@id": "pkg:deb/debian/zlib1g@1.2.13.dfsg-1?arch=amd64&distro=debian-12.15&epoch=1" },
            { "@id": "pkg:deb/debian/zlib1g-dev@1.2.13.dfsg-1?arch=amd64&distro=debian-12.15&epoch=1" }
          ]
        }
      ],
      "status": "not_affected",
      "justification": "vulnerable_code_not_present",
      "status_notes": "MiniZip is not part of Debian's zlib1g or zlib1g-dev packages; dpkg -L lists no MiniZip files."
    }
  ]
}
```

Every identifier is the one Trivy reports for the `linux/amd64` image, checked on 2026-10-20 with
`trivy image --platform linux/amd64 --image-src remote --format cyclonedx node:24.21.0`. The
product is the `node:24.21.0` base image rather than the built batch image, because that is what
the base-image scan reads. When the base image changes, its digest
changes, and the statement has to be checked again like any other not-affected decision.

**Only publish what is safe to publish.** A VEX file in this public repository is readable by
anyone. `not_affected` and `fixed` statements give nothing away. An `affected` statement for a T1
or T2 component tells an attacker where DAWSON is still vulnerable, so it stays in the draft
advisory until the fix ships, like any other detail of a sensitive finding.
