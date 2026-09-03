# Container Scanning

DAWSON uses [Trivy](https://trivy.dev/) to scan Dockerfiles and built container images for vulnerabilities. All scanning is in `.github/workflows/security-containers.yml`.

## Jobs

| Job | What it scans | Trigger | Blocking? |
|-----|--------------|---------|-----------|
| `trivy-config` | Dockerfile misconfigurations (all Dockerfiles in repo) | PR or manual dispatch | No (warn-only) |
| `trivy-image` | Built images: `ef-cms-us-east-1`, `efcms-local` | PR or manual dispatch | No (warn-only) |
| `trivy-runtime-base` | Base images: `node:24.16.0-slim` (puppeteer), `node:24` (batch) | PR or manual dispatch | No (warn-only) |
| `trivy-baseline` | All four images above (full baseline) | Push to staging | No (informational) |
| `containers-gate` | Aggregates above three PR/manual jobs | PR or manual dispatch | Yes (infra failures only) |

All scans currently use `exit-code: '0'` (warn-only). Findings appear in the **Security tab** under categories `trivy-config`, `trivy-image-base`, `trivy-image-local`, `trivy-image-puppeteer`, `trivy-image-batch`.

## Images scanned

| Image | Built from | Purpose |
|-------|-----------|---------|
| `ef-cms-us-east-1` | `Dockerfile` | Production Lambda base image |
| `efcms-local` | `Dockerfile-local` (FROM ef-cms-us-east-1) | Local dev / CI test runner |
| `node:24.16.0-slim` | Docker Hub | Puppeteer / PDF generation base |
| `node:24` | Docker Hub | Batch processing base |

## Scan types

### Dockerfile config scan (`trivy-config`)

Checks for misconfigurations in Dockerfiles (e.g., running as root, using `latest` tag, missing health checks). Severity threshold: MEDIUM and above.

Excluded directories: `node_modules`, `.terraform`, `web-api/terraform`, `coverage`, `dist`, `dist-public`, `dist-lambdas`, `cypress`.

### Image vulnerability scan (`trivy-image`, `trivy-runtime-base`)

Scans OS packages and application libraries in the built image for known CVEs. Severity threshold: HIGH and CRITICAL only.

## Staging baseline

The `trivy-baseline` job runs on every push to staging and scans all four images. This populates the Security tab with the full vulnerability picture of what's deployed, separate from the per-PR delta.

To run the PR-style image scans manually after merging:

```bash
gh workflow run security-containers.yml --ref staging
RUN_ID="$(gh run list --workflow security-containers.yml --branch staging --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$RUN_ID" --exit-status
```

## Flipping to blocking

The shared `.github/actions/dawson-trivy-image-scan/action.yml` action has the `ROLLOUT GUARD`
marking image scans as warn-only. To make image scans blocking:

1. Triage existing findings — either fix them or add to `.trivyignore`
2. Change `exit-code: '0'` to `exit-code: '1'` in `dawson-trivy-image-scan/action.yml`
3. The `containers-gate` job will then fail PRs that introduce new vulnerabilities

Confirm with the team lead before flipping any scan to blocking.

## Database mirrors

Trivy DB is configured to pull from both `ghcr.io` and `public.ecr.aws` mirrors (via `TRIVY_DB_REPOSITORY` and `TRIVY_JAVA_DB_REPOSITORY` env vars) to avoid rate-limiting on either.
