# Scanner Reference

Facts about DAWSON's security scanners that the [remediation playbook](playbook.md) relies on:
what each scanner reports and where, how to suppress a finding in each one, and how a fix reaches
each image. These change whenever a `.github/workflows/security-*.yml` file or a Dockerfile
changes, so they live here rather than in the playbook. The playbook's rules for approving a
suppression apply to every mechanism below.

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
- **No scanner checks npm devDependencies.** npm audit runs with `--omit=dev`, and Trivy ["doesn't
  report development dependencies"](https://trivy.dev/latest/docs/coverage/language/nodejs/) unless
  `--include-dev-deps` is set, which no DAWSON workflow does. T3 npm packages, Cypress included, are
  therefore not reported today.
- **The weekly Monday 06:00 UTC run** (`cron: '0 6 * * 1'`) is currently set only on
  `security-containers.yml` and `security-dast.yml`. The other workflows refresh the Security tab
  on every push to staging.
- **CI never forces a fix of an existing finding.** The blocking checks above stop new problems
  from merging; everything already in the Security tab is driven by the SLAs in this playbook.

## Suppression mechanisms

| Scanner | Mechanism | Scope | Notes |
| --- | --- | --- | --- |
| Semgrep | `// nosemgrep: <rule-id>` comment on the flagged line | One line | Always name the rule; a bare `nosemgrep` hides every rule on that line. Not used anywhere in the code today. |
| Checkov | `#checkov:skip=<CHECK_ID>:<reason>` comment inside the Terraform resource | One resource | The normal way to suppress Checkov. There are about 180 in the Terraform today, for example in `terraform-state-backend.tf`. |
| Checkov | `.checkov.baseline` in the applyable directory | Existing findings in one directory | For findings that existed before the scan. Two of the nine directories have entries. Prefer an inline skip for anything new. |
| Checkov | `--skip-check` in `security-sast.yml` | The check, everywhere | Only for a check that can never apply to DAWSON. It needs a workflow change. |
| CodeQL | Dismissal in the Security tab | One alert | Whole directories are excluded through `paths-ignore` in `.github/codeql/codeql-config.yml`. |
| Trivy (all scans) | Dismissal in the Security tab | One alert | The only mechanism. There is no `.trivyignore`. |
| Gitleaks | `.gitleaksignore` entry (`<commit-sha>:<fingerprint>`) | One finding | For a confirmed false positive, or a real secret only after it has been rotated and the old value is confirmed revoked. The file's header explains how to get the fingerprint. |
| Gitleaks | `allowlist` in `.gitleaks.toml` | A path or pattern, everywhere | For a pattern that is never a secret, such as a known placeholder. |
| Dependency review | `allow-ghsas` in `security-supply-chain.yml` | One advisory | A comma-separated list of GHSA IDs. Matters only once the job stops being `warn-only`. |
| npm audit | None | — | Patch or accept. The job does not block PRs. |
| OWASP ZAP | `IGNORE` line in `.zap/rules.tsv` (`<rule-id>`, tab, `IGNORE`, tab, reason) | The rule, in every ZAP scan | All four ZAP scans read this file. Today it has three `WARN` lines and no `IGNORE`. |

**Dismissing in the Security tab.** Pick the reason that matches, and write a comment in this
format. GitHub limits the comment to 280 characters.

| Reason | Use it for |
| --- | --- |
| `false positive` | Not affected, or the scanner is wrong |
| `won't fix` | An accepted risk |
| `used in tests` | Code that only runs in tests, when the approver agrees it needs no fix |

```text
not_affected: vulnerable_code_not_present. Evidence and review date in #<issue>. Approved: @<approver>
```

For a sensitive finding, use the GHSA ID in place of the issue number, and leave the evidence out
of the comment; it belongs in the advisory.

Dismissed alerts stay dismissed when a later scan reports them again, so a dismissal outlives the
reason for it unless someone reviews it. That is why the review date is required.

## Rebuilding images

A fix in an image reaches its users differently for each image, and the scan clears on a
different event.

| Image | To take a fix | When it reaches its users | When the alert clears |
| --- | --- | --- | --- |
| `ef-cms-us-east-1` (T2) | Change `FROM` in `Dockerfile`, increase the `efcms-docker-image` tag in `.circleci/config.yml`, then publish the image with `npm run deploy:ci-image`. See [Dependency Updates](../../dependency-updates.md), "Publish new ECR docker image". | When CircleCI starts using the new tag, once it is published to each environment's ECR. Publishing needs AWS credentials, so a person does it. | After the next `trivy-baseline-base` run on `staging`. The scan builds from `Dockerfile`, so it can clear before CircleCI uses the new image; keep the record open until the tag is published. |
| Batch `docket-entry-zipper` (T1) | Change `FROM` in `web-api/terraform/modules/batch/docker-image/Dockerfile` | On the next deploy; CircleCI's `docker-image-zipper` job rebuilds it with `--no-cache` every time | After the next `trivy-baseline-batch` run |
| Puppeteer layer (T1) | Patch `web-api/runtimes/puppeteer/package-lock.json` | On the next deploy; CircleCI's deploy job rebuilds the layer every time | After the next `trivy` run on `staging`. The filesystem scan reads all three lockfiles, this one included. |
| Puppeteer `Dockerfile` (T3) | Change `FROM` in `web-api/runtimes/puppeteer/Dockerfile` | The next time someone builds the layer locally | After the next `trivy-baseline-puppeteer` run |

Things to know:

- **Base-image scans clear only when `FROM` changes.** They scan the image named on the `FROM`
  line, not the image DAWSON builds. A fix added inside a Dockerfile, such as
  `apt-get install --only-upgrade <package>`, protects the built image but leaves the alert open.
  That is still worth doing for a T1 Critical finding while waiting for a new base image: dismiss
  the alert as `won't fix` with a comment pointing to the PR. The dismissal hides the alert, so
  nothing will show when the base image catches up. Keep the tracking record open, check for a new
  base image at each weekly triage, and remove the extra line when the `FROM` bump lands.
- **Keep Node versions in step.** All three Dockerfiles use Node base images. When a `FROM` change
  moves to a new Node version, follow the "To update Node.js" list in [Dependency
  Updates](../../dependency-updates.md), so the Lambda runtime and the images stay on the same
  version.
- **Check where the fix is before opening a PR.** See the `apt-cache policy` example in [Worked
  examples](playbook.md#worked-examples): a fix can be in Debian without being in any image yet.
