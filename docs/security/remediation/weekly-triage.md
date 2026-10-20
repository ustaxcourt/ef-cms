# Weekly Security Triage - Review the week's new security findings

## Description

Every Monday, after the 06:00 UTC scheduled scans, the weekly triager defined in the
[remediation playbook](playbook.md#roles) works through these steps to find the week's new
security findings and turn them into tracking records. The playbook sets the rules (severity,
SLAs, who approves); this runbook is the commands. It also covers the one-time
[backlog clean-up](#backlog-clean-up) when the playbook is adopted.

## Prerequisites

- A clone of `ustaxcourt/ef-cms`, with `origin` pointing at it. None of the steps change your
  working tree or current branch.
- The [GitHub CLI](https://cli.github.com/) signed in (`gh auth status`) as a user with write
  access to the repository. Step 1 starts a workflow run, which needs write access.
- Node.js and npm, at the version in `.nvmrc`, for step 4.
- `jq`, only for the [backlog clean-up](#backlog-clean-up) script.
- The approver's contact details, for anything that cannot wait (see
  [Same-day triage](playbook.md#same-day-triage)).

## Steps

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
   the [weekly report](#weekly-report) that its results are missing until the rerun passes.

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
   ([Severity rubric](playbook.md#severity-rubric)), and open or update its tracking record
   ([Where findings are tracked](playbook.md#where-findings-are-tracked)).
8. **Check what is due.** List open security findings and raise with the approver any whose due
   date or review date is within 14 days or already past (see
   [Missing an SLA](playbook.md#missing-an-sla) and
   [On the review date](playbook.md#on-the-review-date)):

   ```sh
   gh issue list --repo ustaxcourt/ef-cms --state open --search 'in:title "Security finding"' \
     --limit 200
   ```

9. **Post the [weekly report](#weekly-report).** Its triage date is the next triage's `SINCE`.

## Which categories to triage

On `staging`, some Security-tab categories hold current results and some only hold old or
duplicate ones. The query in step 6 already applies this table.

| Category | Updated on `staging` by | Triage? |
| --- | --- | --- |
| `trivy-baseline-base`, `trivy-baseline-puppeteer`, `trivy-baseline-batch` | Weekly run, and pushes that change image paths | Yes |
| `trivy` | Every push | Yes |
| `semgrep`, `checkov`, `/language:javascript-typescript` | Every push | Yes |
| `gitleaks-baseline` | Every push | Yes. New alerts the same day (see [Same-day triage](playbook.md#same-day-triage)); alerts that predate the playbook in the [backlog clean-up](#backlog-clean-up). |
| `trivy-config` | Manual runs (step 1) | Yes |
| `trivy-image-base`, `trivy-image-puppeteer`, `trivy-image-batch` | Manual runs (step 1) | No: duplicates by design. They scan the same images as `trivy-baseline-*`, and step 1 refreshes them every week, so they stay open. Leave them out of every count, report and SLA. |
| `trivy-baseline-local`, `trivy-image-local` | Nothing. The `efcms-local` scan was removed. | No. Retire them (see [Backlog clean-up](#backlog-clean-up)). |

This table decides the size of the backlog. On 2026-10-16, 12,292 of the open alerts on
`staging` came from Trivy, but only 1,084 of those were in triaged categories. The rest were
7,002 `trivy-image-*` duplicates and 4,206 alerts in the retired `efcms-local` categories. The
other large group is `gitleaks-baseline`: 916 open alerts on 2026-10-20, 874 of them from its first
scan on 2026-09-03.

## Backlog clean-up

This is done once, during the 30-day clean-up window after the playbook is adopted.

The approver owns the 30-day clean-up window that starts on the adoption date (see [When the clock
starts](playbook.md#when-the-clock-starts)) and makes sure both of these are done before it ends.

**Retire what no longer means anything.** This needs write access to the repository.

- **The `efcms-local` categories.** `scripts/run-once-scripts/dismiss-duplicate-local-alerts.sh`
  dismisses the alerts that repeat the CI image's CVEs. Run it without arguments first to see
  what it would dismiss, then with `--apply`. It deliberately leaves alerts under real file paths,
  which come from that image's `npm ci` layer and appear in no other category. Triage those like
  any other finding.
- **Categories retired later.** Either dismiss their alerts, or have a repository admin [delete the
  category's
  analyses](https://docs.github.com/en/rest/code-scanning/code-scanning#delete-a-code-scanning-analysis-from-a-repository).
  Removing a scan never closes the alerts it already reported.

Dismissing an alert hides it for good, so dismiss only confirmed duplicates and alerts from scans
that no longer run. Everything else goes through the rubric.

**Triage the open alerts in triaged categories.** The weekly routine only picks up new alerts, so
the existing ones need one pass of their own. Run the step 6 query with `SINCE=2000-01-01`, then
group the results by the fix that would close them, not by CVE. Nearly all of the 1,084 Trivy
alerts come from three base images, so they collapse into a handful of base-image upgrades. Open one
tracking record per group. Their SLA clocks start in the two waves described in
[When the clock starts](playbook.md#when-the-clock-starts).

**Triage the existing `gitleaks-baseline` alerts as a batch.** Most of them were found when the
scan first ran over the whole tree, and most look like test values. Of the 916 open on 2026-10-20,
522 were `generic-api-key` and 348 were `jwt`, many under test and local-development paths. They
cannot each go through [Secrets](playbook.md#secrets) on the day, so:

1. **Start with `aws-access-token` alerts** (32 on 2026-10-20), within the first few days of the
   window. For each key ID, `aws iam get-access-key-last-used --access-key-id <id>` shows whether
   it belongs to a DAWSON account and whether it has been used. Any real key goes through
   [Secrets](playbook.md#secrets) straight away.
2. **Group the rest by rule and path.** A group of made-up values in test fixtures, for example,
   is one false-positive decision with one justification, silenced by an `allowlist` pattern in
   `.gitleaks.toml` or by `.gitleaksignore` entries.
3. **Anything that might be real** goes through [Secrets](playbook.md#secrets) on its own.

List them by rule and path:

```sh
gh api --paginate \
  "repos/ustaxcourt/ef-cms/code-scanning/alerts?state=open&ref=refs/heads/staging&tool_name=gitleaks&per_page=100" \
  --jq '.[] | select(.most_recent_instance.category == "gitleaks-baseline")
        | [.rule.id, .most_recent_instance.location.path, .html_url] | @tsv' \
  | sort
```

## Weekly report

What the report must cover, and where it is posted, is in
[Reporting](playbook.md#reporting). Copy this template:

```markdown
**Security triage, <YYYY-MM-DD>**
Scheduled scans: <all ran | which failed, and whether the rerun passed>

New since <last triage date>: <count by DAWSON severity and tier, e.g. "1 High T1, 3 Medium T3">
Closed: <count, with issue links>
Overdue or due within 14 days: <issue links and due dates>
Exceptions to review within 14 days: <issue links and review dates>
Backlog: <open alerts in triaged categories> (last week: <n>)
Decisions needed: <for the approver or product owner, or "none">
```

The counts come from the Security tab. Set `SINCE` to the last triage date, as in step 6:

```sh
CATS='^(trivy-baseline-(base|puppeteer|batch)|trivy|trivy-config|semgrep|checkov|/language:.*|gitleaks-baseline)$'

# Open alerts in triaged categories, by category and GitHub severity (the backlog line)
gh api --paginate \
  "repos/ustaxcourt/ef-cms/code-scanning/alerts?state=open&ref=refs/heads/staging&per_page=100" \
  --jq '.[] | select(.most_recent_instance.category | test("'"$CATS"'"))
        | [.most_recent_instance.category, (.rule.security_severity_level // .rule.severity)] | @tsv' \
  | sort | uniq -c

# Alerts fixed since the last triage (the closed line). Fetches newest first and stops at
# SINCE, because paging through every fixed alert ever takes minutes.
page=1
while :; do
  rows=$(gh api "repos/ustaxcourt/ef-cms/code-scanning/alerts?state=fixed&ref=refs/heads/staging&sort=updated&direction=desc&per_page=100&page=$page" \
    --jq '.[] | [.updated_at, .fixed_at, .most_recent_instance.category] | @tsv')
  [ -z "$rows" ] && break
  printf '%s\n' "$rows" | awk -F'\t' -v since="$SINCE" '$2 >= since { print $3 }'
  printf '%s\n' "$rows" | tail -n 1 | awk -F'\t' -v since="$SINCE" '$1 < since { exit 1 }' || break
  page=$((page + 1))
done | grep -E "$CATS" | sort | uniq -c
```

The first command reads every open alert, so it takes a minute or two.

These show GitHub's severity, not DAWSON's. The report's severity and tier counts come from the
tracking records, where the rubric has been applied. Due dates and review dates come from step 8.

## Additional Resources

- [Remediation playbook](playbook.md): severity rubric, SLAs, tracking rules and roles
- [Scanner reference](scanner-reference.md): what each scanner reports, and how to suppress a
  finding in each one
- [#10496](https://github.com/ustaxcourt/ef-cms/issues/10496): publishing ZAP results to the
  Security tab, which removes step 3
- GitHub's [code scanning REST API](https://docs.github.com/en/rest/code-scanning/code-scanning),
  used by step 6 and the backlog clean-up
