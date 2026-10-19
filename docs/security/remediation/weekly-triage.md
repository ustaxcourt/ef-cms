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
   ([Severity rubric](playbook.md#severity-rubric)), and open or update its tracking record
   ([Where findings are tracked](playbook.md#where-findings-are-tracked)).
8. **Check what is due.** List open security findings and raise any due within 14 days, or
   already past due, with the approver (see [Missing an SLA](playbook.md#missing-an-sla)):

   ```sh
   gh issue list --repo ustaxcourt/ef-cms --state open --search 'in:title "Security finding"' \
     --limit 200
   ```

9. **Record the date** of this triage in the weekly report. It is the next triage's `SINCE`.

## Which categories to triage

On `staging`, some Security-tab categories hold current results and some only hold old or
duplicate ones. The query in step 6 already applies this table.

| Category | Updated on `staging` by | Triage? |
| --- | --- | --- |
| `trivy-baseline-base`, `trivy-baseline-puppeteer`, `trivy-baseline-batch` | Weekly run, and pushes that change image paths | Yes |
| `trivy` | Every push | Yes |
| `semgrep`, `checkov`, `/language:javascript-typescript` | Every push | Yes |
| `gitleaks-baseline` | Every push | Yes, the same day (see [Same-day triage](playbook.md#same-day-triage)) |
| `trivy-config` | Manual runs (step 1) | Yes |
| `trivy-image-base`, `trivy-image-puppeteer`, `trivy-image-batch` | Manual runs (step 1) | No: duplicates by design. They scan the same images as `trivy-baseline-*`, and step 1 refreshes them every week, so they stay open. Leave them out of every count, report and SLA. |
| `trivy-baseline-local`, `trivy-image-local` | Nothing. The `efcms-local` scan was removed. | No. Retire them (see [Backlog clean-up](#backlog-clean-up)). |

This table decides the size of the backlog. On 2026-10-16, 12,292 of the open alerts on
`staging` came from Trivy, but only 1,084 of those were in triaged categories. The rest were
7,002 `trivy-image-*` duplicates and 4,206 alerts in the retired `efcms-local` categories.

## Backlog clean-up

This is done once, during the 30-day clean-up window after the playbook is adopted.

The approver owns the 30-day clean-up window that starts on the adoption date (see
[When the clock starts](playbook.md#when-the-clock-starts)) and makes sure both of these are done before it
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
[When the clock starts](playbook.md#when-the-clock-starts).

## Additional Resources

- [Remediation playbook](playbook.md): severity rubric, SLAs, tracking rules and roles
- [Scanner reference](scanner-reference.md): what each scanner reports, and how to suppress a
  finding in each one
- [#10496](https://github.com/ustaxcourt/ef-cms/issues/10496): publishing ZAP results to the
  Security tab, which removes step 3
- GitHub's [code scanning REST API](https://docs.github.com/en/rest/code-scanning/code-scanning),
  used by step 6 and the backlog clean-up
