# Container Scanning

DAWSON uses [Trivy](https://trivy.dev/) to scan Dockerfiles and built container images for vulnerabilities. All scanning is in `.github/workflows/security-containers.yml`.

## Jobs

| Job | What it scans | Trigger | Blocking? |
|-----|--------------|---------|-----------|
| `trivy-config` | Dockerfile misconfigurations (all Dockerfiles in repo) | PR or manual dispatch | No (warn-only) |
| `trivy-image` | Built image: `ef-cms-us-east-1` | PR that changes image paths, or manual dispatch | No (warn-only) |
| `trivy-runtime-image` | Built images: puppeteer and batch, from their Dockerfiles | PR that changes image paths, or manual dispatch | No (warn-only) |
| `trivy-baseline` | All three images above (full baseline) | Push to staging that changes image paths, and weekly (Monday 06:00 UTC) | No (informational) |
| `containers-gate` | Aggregates above three PR/manual jobs | PR or manual dispatch | Yes (infra failures only) |

All scans currently use `exit-code: '0'` (warn-only).

"Image paths" are any `Dockerfile*`, the batch image's build context
(`web-api/terraform/modules/batch/docker-image/`), the puppeteer `package.json` and
`package-lock.json`, this workflow, and the `dawson-container-images`, `dawson-runtime-image`,
`dawson-trivy-image-scan`, `dawson-upload-sarif` and `dawson-sarif-summary` actions. Nothing else
can change what the scanned images contain: `ef-cms-us-east-1` copies no application source or
lockfile, and the batch and puppeteer images copy only those files. The weekly run picks up CVEs published
against images that have not changed. It uploads to the same `trivy-baseline-*` categories as
staging pushes, so an alert still present stays one alert and only a new CVE opens a new one.

On PRs that change no image paths, `containers-gate` still runs and passes, so it stays safe to
require in branch protection.

SARIF reaches the **Security tab** only from pushes to staging, the weekly run, and manual dispatches, under categories `trivy-config`, `trivy-image-base`, `trivy-image-puppeteer`, `trivy-image-batch` (manual dispatch) and `trivy-baseline-base`, `trivy-baseline-puppeteer`, `trivy-baseline-batch` (staging and weekly). A PR, whatever branch it targets, reports its findings in the workflow log and job summary instead. Both list every finding, most severe first, with its file, package, installed and fixed versions, and a link to the advisory (up to 100 per scan, with a by-rule count beyond that).

Removing a scan does not clear alerts it already reported. Existing alerts have to be dismissed in the Security tab, or their analyses deleted by a repo admin.

## Images scanned

| Image | Built from | Purpose |
|-------|-----------|---------|
| `ef-cms-us-east-1` | `Dockerfile` | CircleCI build, test and deploy image |
| `efcms-local` | `Dockerfile-local` (FROM ef-cms-us-east-1) | Local dev / CI test runner — **not scanned** |
| `puppeteer-layer` | `web-api/runtimes/puppeteer/Dockerfile` | Builds the puppeteer Lambda layer zip for deploys run outside CircleCI; the image itself is not deployed |
| `docket-entry-zipper` | `web-api/terraform/modules/batch/docker-image/Dockerfile` | AWS Batch job that zips docket entries |

The `dawson-runtime-image` action builds the puppeteer and batch images, so the scans include
what their Dockerfiles add on top of the base image, such as `awscli` and the global
`ts-node`/`typescript` in batch. Batch is built with placeholder `AWS_REGION` and
`WEBSOCKET_API_GATEWAY_ID` build args; the scan needs no real values.

Until October 2026 these two scans covered only the Docker Hub `node` base images. Alerts record
the scanned image's name as their location, so the first scan of the built images is expected to
close the old `library/node` alerts and report the same CVEs again under `docket-entry-zipper` and
`puppeteer-layer`. Dismissals made on the old alerts would not carry over.

`efcms-local` is `FROM ef-cms-us-east-1` plus `COPY . /home/app` and `npm ci`. It installs no OS
packages, so the CVEs reported against the image itself restated the base image's, under a second
image name: 3,327 of its staging alerts duplicated `trivy-baseline-base` exactly.

The `npm ci` layer is not duplicated. Around 180 alerts sit under real file paths, mostly
vulnerable dependencies bundled inside the Cypress binary in `~/.cache`, and those appear in no
other category. Retiring this scan gives that up. It is an accepted trade: `efcms-local` is a
local dev and CI test runner that is never deployed, and dependencies declared in a lockfile are
still covered by the full-tree scan in `security-supply-chain.yml`. The image is still built for
the PDF and integration test workflows.

## Scan types

### Dockerfile config scan (`trivy-config`)

Checks for misconfigurations in Dockerfiles (e.g., running as root, using `latest` tag, missing health checks). Severity threshold: MEDIUM and above, plus UNKNOWN.

Excluded directories: `node_modules`, `.terraform`, `web-api/terraform`, `coverage`, `dist`, `dist-public`, `dist-lambdas`, `cypress`.

### Image vulnerability scan (`trivy-image`, `trivy-runtime-image`)

Scans OS packages and application libraries in the built image for known CVEs. Severity threshold: HIGH and CRITICAL, plus UNKNOWN.

UNKNOWN is included deliberately: a CVE with no CVSS score yet can be rated high later, and
excluding it would hide the finding until someone happened to rescan after the rating landed.

`limit-severities-for-sarif: true` must accompany the `severity` input. Without it, trivy-action
unsets the filter for SARIF output and uploads every severity, including LOW and UNKNOWN.

## Staging baseline

The `trivy-baseline` job runs on pushes to staging that change image paths and every Monday, and scans all three of them. This populates the Security tab with the full vulnerability picture of what's deployed, separate from the per-PR delta.

To run the PR-style image scans manually after merging:

```bash
gh workflow run security-containers.yml --ref staging
RUN_ID="$(gh run list --workflow security-containers.yml --branch staging --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$RUN_ID" --exit-status
```

## Flipping to blocking

The shared `.github/actions/dawson-trivy-image-scan/action.yml` action has the `ROLLOUT GUARD`
marking image scans as warn-only. To make image scans blocking:

1. Triage existing findings — either fix them or record them as VEX statements in `.vex/ef-cms.openvex.json` (see [container-findings-triage.md](container-findings-triage.md)), and pass that file to the scans with Trivy's `--vex` option
2. Change `exit-code: '0'` to `exit-code: '1'` in `dawson-trivy-image-scan/action.yml`
3. The `containers-gate` job will then fail PRs that introduce new vulnerabilities

Confirm with the team lead before flipping any scan to blocking.

## Database mirrors

Trivy DB is configured to pull from both `ghcr.io` and `public.ecr.aws` mirrors (via `TRIVY_DB_REPOSITORY` and `TRIVY_JAVA_DB_REPOSITORY` env vars) to avoid rate-limiting on either.
