# DAW-21 implementation plan

Scan the container images production actually runs, read from ECR, instead of images rebuilt from their Dockerfiles. We add:

- one small composite action that finds the right image
- one reusable workflow that scans it
- one job in [security-containers.yml](.github/workflows/security-containers.yml) that runs that workflow every week

The existing Trivy and SARIF actions are reused. AWS access comes from the read-only role in DAW-20. Puppeteer is excluded: it has no standalone image in ECR.

DAWSON's CI/CD is moving from CircleCI to GitHub Actions. Today GitHub Actions already runs the checks (tests, lint, type checks, security scans, including this scan), but every deploy still runs in CircleCI (`.circleci/config.yml`). No GitHub Actions workflow deploys or uses AWS yet. CircleCI is being retired, so this plan reads nothing from `.circleci/config.yml`: both images are found from AWS alone. Section 2 lists what changes and when.

Two images are in scope:

| Image | What it is | Where it runs | How we find the one prod uses |
| --- | --- | --- | --- |
| `ef-cms-us-east-1` | CI/deploy toolchain (Node, Java, AWS CLI, browsers). Builds and deploys the Lambda zips. | CircleCI deploy jobs today, with prod deploy credentials. After the migration, only if the GitHub Actions deploy jobs run inside it (open decision 1). | For now, the highest version tag (`X.Y.Z`) in prod's `ef-cms-us-east-1` ECR repo. A follow-up story switches this to the tag or digest the deploy records in SSM (section 8). |
| `docket-entry-zipper-prod-<color>-us-east-1` | The docket entry zip job, the only part of DAWSON that runs as a container | AWS Batch on Fargate | The live color in SSM `/DAWSON/prod/current-color`, then that color's `:latest`. Not affected by the migration. |

Batch findings are in production code. CI image findings are in tooling that holds prod deploy credentials but doesn't serve users. Triage notes should say which one a finding came from.

## 1. How a run works

Every Monday at 06:00 UTC (or on a manual run from `staging`), GitHub runs the scan job twice, once per image, in parallel. **Both images are scanned on every run.** The only difference is how step 3 finds the tag:

| Step | `ci-image` copy | `batch` copy | Implemented by |
| --- | --- | --- | --- |
| 1. Check out | Normal checkout of `staging`, needed for our local actions | same | `actions/checkout@v7` |
| 2. AWS credentials | GitHub issues a short-lived OIDC token for environment `image-scan-prod`. AWS swaps it for 1-hour credentials for the DAW-20 role. The account ID is masked from here on. | same | `aws-actions/configure-aws-credentials@v6.3.0` |
| 3. Find the tag | List the tags in `ef-cms-us-east-1` and take the highest `X.Y.Z`. Snapshot and other tags are ignored. | Read `/DAWSON/prod/current-color` (`blue` or `green`). Repo `docket-entry-zipper-prod-<color>-us-east-1`, tag `latest`. | new `dawson-deployed-image` action → `resolve-deployed-image.sh` |
| 4. Pin to a digest | `aws ecr describe-images` returns the digest and account ID. Builds `<account>.dkr.ecr.us-east-1.amazonaws.com/<repo>@sha256:…`. | same | same script |
| 5. Scan | Trivy reads the layers straight from ECR (no `docker pull`). Report-only. | same | existing `dawson-trivy-image-scan`, job env `TRIVY_IMAGE_SRC=remote` |
| 6. Report | SARIF to the Security tab under `trivy-deployed-prod-ci-image`. Public finding list turned off. | same, under `trivy-deployed-prod-batch` | existing `dawson-upload-sarif`, new input `summarize: 'false'` |

Any doubt in steps 2–4 (access denied, unexpected color, missing tag, empty digest) fails that copy with a clear message, and the other copy carries on. A scan of the wrong image is worse than a failed run.

## 2. CircleCI → GitHub Actions: what changes

| Part of this plan | While CircleCI deploys | After the migration |
| --- | --- | --- |
| Where the scan runs | GitHub Actions | Same. No change. |
| Batch image lookup | SSM color + `:latest` | Same, as long as the migrated deploy still pushes with [deploy-to-ecr.sh](web-api/terraform/modules/batch/docker-image/deploy-to-ecr.sh) and switches with [switch-colors.sh](web-client/switch-colors.sh). Re-check after the migration that `switch-colors.sh` is still the only thing that writes `current-color`. |
| CI image tag | Highest version tag in ECR. Doesn't depend on CircleCI. | Follow-up story: the deploy writes the tag or digest it used to SSM, and the script reads that instead. If the deploy jobs stop using this image, drop `ci-image` from the scan. |
| When scans run | Weekly + manual | Weekly + manual, **plus right after each deploy**: the deploy workflow calls the same reusable workflow after `switch-colors` (section 5.4). This is why the scan is a reusable workflow, not an inline job. |
| AWS access | DAW-20 scan role | Same role. The deploy workflows will need their own, much broader role. Keep them separate, and **share the GitHub OIDC provider** DAW-20 creates: AWS allows one per account. |
| Validation evidence | The CircleCI deploy log shows the CI image digest it pulled | The GitHub Actions deploy log ("Initialize containers") shows it. |
| Switch approval | The Sunday cron Lambda approves a CircleCI job ([switch-colors-cron.ts](web-api/src/lambdas/switch-colors/switch-colors-cron.ts)) | Replaced by the migration. It doesn't affect this plan as long as SSM is still written by `switch-colors.sh`. |

## 3. What exists today (from the code review)

| Area | Finding | Consequence |
| --- | --- | --- |
| Workflow | [security-containers.yml](.github/workflows/security-containers.yml) runs on PRs, manual runs, pushes to `staging` (image paths only) and Mondays 06:00 UTC. `containers-gate` covers PRs only. | New job runs on schedule and manual runs only, outside the gate. |
| Scan action | [dawson-trivy-image-scan](.github/actions/dawson-trivy-image-scan/action.yml) takes any `image_ref`; trivy-action v0.36.0 (Trivy v0.70.0), `exit-code: 0`. | Reused, plus a pass-through input. |
| Summary | [dawson-upload-sarif](.github/actions/dawson-upload-sarif/action.yml) always runs [dawson-sarif-summary](.github/actions/dawson-sarif-summary/action.yml), which lists every finding publicly. | Needs an off switch. |
| Remote scanning | Already in use: `trivy-runtime-base` and the base-image `trivy-baseline` scans pass `node:24.22.1(-slim)`, which nothing builds or pulls on the runner. Trivy finds no local copy and downloads it from Docker Hub itself. Only `ef-cms-us-east-1:latest` is read from local Docker, because `dawson-container-images` builds it first. trivy-action runs `trivy image` with the job's environment, so `TRIVY_IMAGE_SRC` and the `AWS_*` credentials reach Trivy. | No `docker pull`. The only new part is **authenticating** to private ECR (Docker Hub needs none). Confirm that in the spike. `TRIVY_IMAGE_SRC=remote` only skips the pointless local check. |
| CI image tags | No `latest` tag: [docker-to-ecr.sh](scripts/ecr/docker-to-ecr.sh) and [pull-and-tag.ts](scripts/ecr/pull-and-tag.ts) push only `X.Y.Z`, and `SNAPSHOT-X.Y.Z-<sha>` when a tag is re-published. A new version reaches an account's ECR (a `CHANGES.md` step) before the deploy that starts using it. | "Latest" means the highest `X.Y.Z`. Right after a publish it can be one version ahead of what deploys use (section 11). |
| Environments | Every deployed environment uses blue/green. Branch → env: `prod`→`prod`, `staging`→`stg`, `test`→`test`, `develop`→`dev`, `irs`, `migration`→`mig`, `experimentalN`→`expN` ([env-for-circle.sh](scripts/env/env-for-circle.sh)). | The action takes the environment name (`prod`, `stg`), not the branch. |
| Live color | Written only by [switch-colors.sh:33](web-client/switch-colors.sh#L33), in the same step that moves traffic. | SSM always names the color receiving traffic. |
| Batch path | Each color's Lambdas submit to `s3-zip-job-<env>-<color>-us-east-1` ([sendZipperBatchJob.ts:49](web-api/src/dispatchers/batch/sendZipperBatchJob.ts#L49)), which runs `docket-entry-zipper-<env>-<color>-us-east-1:latest` ([batch.tf:160](web-api/terraform/modules/batch/batch.tf#L160)). Deploys push only to the non-live color. | SSM color + `:latest` = what the next batch job pulls. |
| Old color script | [get-current-color.sh](scripts/ssm/get-current-color.sh) returns `green` on any error. | Not reused. |
| ECR | Tags can be overwritten; each repo keeps its last 15 images. | Always pin to a digest. |
| Script tests | [summarize-sarif.test.ts](scripts/github-actions/summarize-sarif.test.ts) runs an action's bash script from Jest with `spawnSync`. `test:scripts` runs on every PR. | Same pattern. |

## 4. Spike (first, about an hour)

Run against any lower environment you have credentials for. The logic is the same as prod. Remote downloading itself is already proven by the base-image scans; the open question is only whether Trivy logs in to private ECR with the AWS credentials on its own.

- [ ] `TRIVY_IMAGE_SRC=remote trivy image --severity HIGH,CRITICAL,UNKNOWN --format sarif --output <outside-repo>/spike.sarif <acct>.dkr.ecr.us-east-1.amazonaws.com/docket-entry-zipper-<env>-<color>-us-east-1@sha256:…`. Expect it to work without `docker login`.
- [ ] Compare the SARIF to today's `trivy-baseline-batch` output (same shape), and note where the account ID appears in it.
- [ ] Time a scan of the CI image (several GB). It must fit well inside 45 minutes. Same command, but the CI image has no env or color in its name: `<acct>.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1@sha256:…`, using the digest of the highest version tag (`aws ecr describe-images --repository-name ef-cms-us-east-1 --image-ids imageTag=<tag>`).
- [ ] If remote scanning fails: add `aws-actions/amazon-ecr-login` and a `docker pull` step, and drop `TRIVY_IMAGE_SRC`. Nothing else changes.

## 5. Build

Two PRs:

- **PR 1 (no DAW-20 dependency, can merge now):** the lookup action, its tests, and the summary off switch.
- **PR 2 (after DAW-20 is applied in prod):** the reusable workflow and the weekly job.

PR 2 waits because a workflow that names a GitHub Environment that doesn't exist makes GitHub create it, **without the staging-only branch rule**.

### 5.1 PR 1: `.github/actions/dawson-deployed-image/resolve-deployed-image.sh`

```bash
#!/usr/bin/env bash

# Writes a digest-pinned reference to the latest IMAGE (ci-image | batch) for DEPLOY_ENV to $GITHUB_OUTPUT.

set -euo pipefail

REGION="us-east-1"

fail() {
  echo "::error::$*" >&2
  exit 1
}

# AWS errors contain the account ID, so print only the error code.
aws_or_fail() {
  local err_file output code
  err_file="$(mktemp)"
  if ! output="$(aws "$@" 2>"$err_file")"; then
    code="$(sed -n '/An error occurred (/{s/.*An error occurred (\([A-Za-z0-9]*\)).*/\1/p;q;}' "$err_file")"
    rm -f "$err_file"
    fail "aws $1 $2 failed: ${code:-unknown error}"
  fi
  rm -f "$err_file"
  printf '%s' "$output"
}

[[ -n "${GITHUB_OUTPUT:-}" ]] || fail "GITHUB_OUTPUT is not set"
[[ "${DEPLOY_ENV:-}" =~ ^[a-z0-9]+$ ]] || fail "DEPLOY_ENV must be a DAWSON environment name, got '${DEPLOY_ENV:-}'"

case "${IMAGE:-}" in
  ci-image)
    REPO="ef-cms-us-east-1"
    TAGS="$(aws_or_fail ecr describe-images --region "$REGION" --repository-name "$REPO" \
      --filter tagStatus=TAGGED --query 'imageDetails[].imageTags[]' --output text)"
    TAG="$(tr -s '[:space:]' '\n' <<<"$TAGS" | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' | sort -V | tail -n 1 || true)"
    [[ -n "$TAG" ]] || fail "No version tag in $REPO"
    ;;
  batch)
    PARAM="/DAWSON/${DEPLOY_ENV}/current-color"
    COLOR="$(aws_or_fail ssm get-parameter --region "$REGION" --name "$PARAM" --query Parameter.Value --output text)"
    [[ "$COLOR" == "blue" || "$COLOR" == "green" ]] || fail "$PARAM is '$COLOR', expected blue or green"
    REPO="docket-entry-zipper-${DEPLOY_ENV}-${COLOR}-${REGION}"
    TAG="latest"
    ;;
  *)
    fail "IMAGE must be ci-image or batch, got '${IMAGE:-}'"
    ;;
esac

echo "Looking up $REPO:$TAG"
DETAILS="$(aws_or_fail ecr describe-images --region "$REGION" --repository-name "$REPO" \
  --image-ids "imageTag=$TAG" --query 'imageDetails[0].[registryId,imageDigest]' --output text)"
read -r ACCOUNT_ID DIGEST <<<"$DETAILS" || true

[[ "${ACCOUNT_ID:-}" =~ ^[0-9]{12}$ ]] || fail "describe-images returned no registry ID for $REPO:$TAG"
echo "::add-mask::$ACCOUNT_ID"
[[ "${DIGEST:-}" =~ ^sha256:[0-9a-f]{64}$ ]] || fail "describe-images returned no digest for $REPO:$TAG"

echo "image_ref=${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}@${DIGEST}" >>"$GITHUB_OUTPUT"
echo "Scanning $REPO:$TAG at $DIGEST"
```

- **CI image:** `ef-cms-us-east-1` has no `latest` tag. Our scripts push only `X.Y.Z` and `SNAPSHOT-X.Y.Z-<sha>` ([docker-to-ecr.sh](scripts/ecr/docker-to-ecr.sh)). The script lists the account's tags, keeps `X.Y.Z` only, and takes the highest with `sort -V` (`4.3.10` beats `4.3.9`). It reads no CircleCI file, so the migration doesn't affect it. The follow-up story (section 8) replaces this with the tag or digest the deploy records in SSM.
- **Batch:** the live color from SSM, then that color's `:latest`, the tag the job definition runs.
- `describe-images` returns `registryId` (the account ID), so no `sts` call is needed. No permission beyond DAW-20's `ecr:DescribeImages` is needed to list tags.
- configure-aws-credentials masks the account ID before this runs. The `::add-mask::` here covers local use.
- Repo, tag and digest aren't sensitive and are printed so each run shows what it scanned.

### 5.2 PR 1: `.github/actions/dawson-deployed-image/action.yml`

One step for both images. `environment` names the SSM parameter and repo for batch; for the CI image, the AWS credentials decide which account's ECR is read.

```yaml
name: DAWSON Deployed Image
description: Find the latest image an environment's ECR holds and return a digest-pinned reference to it. Needs AWS credentials and a checkout of this repository.

inputs:
  image:
    description: ci-image (highest version tag) or batch (the live color's latest tag).
    required: true
  environment:
    description: DAWSON environment name, e.g. prod or stg.
    required: true

outputs:
  image_ref:
    description: Digest-pinned image reference. Contains the account ID, which is masked, so use it in the same job.
    value: ${{ steps.resolve.outputs.image_ref }}

runs:
  using: composite
  steps:
    - name: Resolve image digest
      id: resolve
      shell: bash
      env:
        IMAGE: ${{ inputs.image }}
        DEPLOY_ENV: ${{ inputs.environment }}
      # Not github.action_path: that is the host path, which containerized jobs cannot see.
      run: '$GITHUB_WORKSPACE/.github/actions/dawson-deployed-image/resolve-deployed-image.sh'
```

### 5.3 PR 1: off switch for the public summary

[dawson-upload-sarif/action.yml](.github/actions/dawson-upload-sarif/action.yml):

```yaml
inputs:
  summarize:
    description: List findings in the log and job summary. 'false' for scans whose findings must not be public.
    required: false
    default: 'true'
# ...
    - name: Summarize SARIF
      if: always() && inputs.summarize == 'true'
```

[dawson-trivy-image-scan/action.yml](.github/actions/dawson-trivy-image-scan/action.yml) gets the same input and passes it through (`summarize: ${{ inputs.summarize }}`). Existing callers don't set it, so they don't change.

### 5.4 PR 1: `scripts/github-actions/resolve-deployed-image.test.ts`

Same structure as `summarize-sarif.test.ts`. Each test gets a temporary directory containing:
- `bin/aws`: a fake AWS CLI, placed first on `PATH`
- `github_output`: an empty file

The fake records every call and answers from environment variables the test sets. A `describe-images` call with `--filter` is the CI image tag listing; one without is the digest lookup:

```bash
#!/usr/bin/env bash
echo "$*" >>"$FAKE_AWS_CALLS"
case "$1 $2" in
  "ssm get-parameter") response="${FAKE_SSM_RESPONSE-}"; error="${FAKE_SSM_ERROR-}" ;;
  "ecr describe-images")
    if [[ " $* " == *" --filter "* ]]; then
      response="${FAKE_ECR_TAGS-}"; error="${FAKE_ECR_TAGS_ERROR-}"
    else
      response="${FAKE_ECR_RESPONSE-}"; error="${FAKE_ECR_ERROR-}"
    fi ;;
  *) echo "unexpected aws call: $*" >&2; exit 99 ;;
esac
if [[ -n "$error" ]]; then
  echo "An error occurred ($error) when calling the operation: User: arn:aws:sts::123456789012:assumed-role/github_actions_image_scan/run is not authorized" >&2
  exit 254
fi
printf '%s\n' "$response"
```

The helper runs `spawnSync('bash', [SCRIPT], { env: { PATH: '<tmp>/bin:' + process.env.PATH, IMAGE, DEPLOY_ENV: 'prod', GITHUB_OUTPUT, FAKE_* } })`. It returns `{ status, stdout, stderr, output, calls }`, where `output` is the `GITHUB_OUTPUT` contents and `calls` is the recorded `aws` calls.

| Group | Case | Asserts |
| --- | --- | --- |
| CI image | Tags `4.3.103 4.3.105 SNAPSHOT-4.3.104-… 4.3.104` | lists tags, then `describe-images` with `imageTag=4.3.105`; output is the full `@sha256:` reference; no SSM call |
| | `4.3.9` vs `4.3.10`; `SNAPSHOT-…`, `latest`, `v4.3.300`, `4.3.103-rc1`; tags over several lines | numeric order; non-version tags ignored |
| | No tags / `None` / only non-version tags | exit 1; no digest lookup |
| Batch | SSM returns `blue`, then `green` | `describe-images` called with `docket-entry-zipper-prod-<color>-us-east-1` and `imageTag=latest` |
| | `DEPLOY_ENV=stg` | reads `/DAWSON/stg/current-color`, uses `docket-entry-zipper-stg-…` |
| | SSM returns empty, `BLUE`, `purple`, `blue extra`, `None` | exit 1; no `describe-images` call; never falls back to a color |
| | Drift guard: reads [batch.tf](web-api/terraform/modules/batch/batch.tf) | contains `docket-entry-zipper-${var.environment}-${var.current_color}-${var.region}:latest`, so pinning a version there fails this test instead of the scan quietly checking the wrong tag |
| Digest | ECR returns `None None`, empty, a short registry ID, a short digest, a `sha512` digest | exit 1; output empty |
| AWS errors | SSM `AccessDeniedException` / `ParameterNotFound`; ECR lookup `AccessDenied` / `ImageNotFound` / `RepositoryNotFound`; tag listing `AccessDenied` / `RepositoryNotFound`; no error code | exit 1; stderr has the error code; **stdout and stderr don't contain `123456789012`** |
| Masking | Success, both images | `::add-mask::` printed, and the account ID appears nowhere else |
| Input | `IMAGE` unset or `other`; `DEPLOY_ENV` unset, `PROD` or `prod/../other`; `GITHUB_OUTPUT` unset | exit 1; no AWS call |

Jest can't measure bash line coverage (same as `summarize-sarif.sh`). These cases exercise every branch, and the PR says so.

PR 1 checklist:
- [x] Script, `action.yml`, `summarize` input on both actions.
- [x] Test file (40 tests); `npm run test:scripts` passes (54 suites, 761 tests, coverage thresholds met).
- [ ] `shellcheck` on the script: not installed locally (`bash -n` passes); `lint.yml` runs `run-shellcheck.sh` on the PR.
- [ ] Optional: run the script locally against a lower environment (`IMAGE=ci-image DEPLOY_ENV=<env> GITHUB_OUTPUT=/dev/stdout`) to see a real digest.

### 5.5 PR 2: new reusable workflow `.github/workflows/security-deployed-images.yml`

One definition of "scan what an environment runs", callable from the weekly job now and from the GitHub Actions deploy later.

```yaml
name: Security - Deployed Images

on:
  workflow_call:
    inputs:
      environment:
        description: DAWSON environment, e.g. prod.
        type: string
        required: true

permissions:
  contents: read

env:
  TRIVY_DB_REPOSITORY: ghcr.io/aquasecurity/trivy-db,public.ecr.aws/aquasecurity/trivy-db
  TRIVY_JAVA_DB_REPOSITORY: ghcr.io/aquasecurity/trivy-java-db,public.ecr.aws/aquasecurity/trivy-java-db

jobs:
  scan:
    name: Trivy Deployed (${{ inputs.environment }}) — ${{ matrix.image }}
    runs-on: ubuntu-latest
    # Holds the role ARN secret. Its branch rule decides which callers may scan.
    environment: image-scan-${{ inputs.environment }}
    permissions:
      contents: read
      id-token: write # OIDC token for AWS
      security-events: write
    timeout-minutes: 45
    strategy:
      fail-fast: false # one image failing must not hide the other's results
      matrix:
        image: [ci-image, batch]
    env:
      # Trivy reads layers straight from ECR. Only in this workflow: the rebuild scans read from the local daemon.
      TRIVY_IMAGE_SRC: remote
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Get read-only AWS credentials
        uses: aws-actions/configure-aws-credentials@v6.3.0
        with:
          role-to-assume: ${{ secrets.AWS_IMAGE_SCAN_ROLE_ARN }}
          role-session-name: trivy-deployed-${{ inputs.environment }}-${{ matrix.image }}
          aws-region: us-east-1
          mask-aws-account-id: true

      - name: Find the image ${{ inputs.environment }} runs
        id: image
        uses: ./.github/actions/dawson-deployed-image
        with:
          image: ${{ matrix.image }}
          environment: ${{ inputs.environment }}

      - name: Trivy scan — ${{ matrix.image }} (${{ inputs.environment }})
        uses: ./.github/actions/dawson-trivy-image-scan
        with:
          image_ref: ${{ steps.image.outputs.image_ref }}
          report_path: trivy-deployed-${{ inputs.environment }}-${{ matrix.image }}.sarif
          category: trivy-deployed-${{ inputs.environment }}-${{ matrix.image }}
          summarize: 'false' # public logs: findings go to the Security tab only
```

Why it's shaped this way:
- **Reusable workflow:**
  - The weekly job and the future post-deploy hook run identical steps.
  - Mike's staging and dev stories become a second caller with `environment: stg` / `dev`, plus their own GitHub Environment and secret.
  - Environment secrets work here because the `environment:` key is on the job inside the reusable workflow.
- **Matrix, lookup inside each entry:**
  - This covers "each image scanned independently".
  - The lookup can't be a separate job, because GitHub drops job outputs that contain a masked value.
- **Role ARN as a secret:** GitHub prints each step's `with:` values in the log. A secret is masked there; a variable isn't.
- **Pinned `v6.3.0`:** it's a new third-party action that handles credentials, and AGENTS.md asks for pinned versions.

### 5.6 PR 2: weekly caller in [security-containers.yml](.github/workflows/security-containers.yml)

```yaml
  # ─────────────────────────────────────────────────────────────────────────────
  # The images prod actually runs, read from prod's ECR (DAW-21). Schedule and manual
  # runs on staging only: image-scan-prod's branch rule refuses other branches.
  # ─────────────────────────────────────────────────────────────────────────────
  trivy-deployed-prod:
    name: Trivy Deployed (prod)
    # The branch check skips manual runs on other branches instead of failing on the environment rule.
    if: >-
      (github.event_name == 'schedule' || github.event_name == 'workflow_dispatch') &&
      github.ref == 'refs/heads/staging'
    uses: ./.github/workflows/security-deployed-images.yml
    # A called workflow can't have more permissions than its caller grants.
    permissions:
      contents: read
      id-token: write
      security-events: write
    with:
      environment: prod
```

- Not added to `containers-gate`, which covers PRs only. No change to existing jobs, triggers or concurrency.
- Add `.github/workflows/security-deployed-images.yml` and `.github/actions/dawson-deployed-image/**` to the `push.paths` list, so a change to them is exercised on `staging` right away.

### 5.7 After the migration: post-deploy hook (owned by the migration work, not this ticket)

Once the prod deploy runs in GitHub Actions, add one job after the color switch:

```yaml
  scan-deployed-images:
    needs: switch-colors
    uses: ./.github/workflows/security-deployed-images.yml
    permissions:
      contents: read
      id-token: write
      security-events: write
    with:
      environment: prod
```

Two things to settle at that point:
- **Branch rule:** that deploy runs on `prod`, so `image-scan-prod`'s branch rule must also allow `prod`.
- **Where the alerts land:** GitHub files code scanning results under the branch the run came from. A run on `prod` would put its alerts under `refs/heads/prod`, separate from the weekly run's alerts on `staging`. Either pass `ref`/`sha` to the SARIF upload so both land on the default branch, or accept two alert lists.

### 5.8 PR 2: docs

- [ ] [scanner-reference.md](docs/security/remediation/scanner-reference.md), scanner inventory: new row `Trivy deployed (prod) | security-deployed-images.yml, called by security-containers.yml / trivy-deployed-prod | Weekly, manual | HIGH, CRITICAL, UNKNOWN | Security tab: trivy-deployed-prod-ci-image, trivy-deployed-prod-batch | No`.
- [ ] Same file, "Rebuilding images": the `ef-cms-us-east-1` row says to keep the record open until the tag is published. Point it at `trivy-deployed-prod-ci-image` as the signal that the fix reached prod. Same for the batch row.
- [ ] [playbook.md](docs/security/remediation/playbook.md): add the new categories wherever it lists the existing ones.
- [ ] `CHANGES.md`: no entry expected; the manual setup is DAW-20's.

PR 2 checklist:
- [ ] Reusable workflow and caller job; `actionlint` (if available) and Prettier.
- [ ] Docs updated.
- [ ] Section 7 validation done and recorded on the ticket.

## 6. Public logs

The repo is public, so workflow logs and job summaries are public.

| Risk | Control |
| --- | --- |
| Prod CVE list in the log and job summary | `summarize: 'false'` |
| Account ID in the role ARN in the step's `with:` block | Role ARN is an environment **secret** |
| Account ID in Trivy's output and image references | `mask-aws-account-id: true`, plus `::add-mask::` in the script |
| Account ID in AWS error messages | The script prints only the error code |
| Account ID inside the uploaded SARIF | Visible to whoever can see code scanning alerts. Open decision 3. |
| Alerts overwriting each other | Categories `trivy-deployed-<env>-<image>`, never `trivy-baseline-*` |

## 7. Validation (manual, after PR 2 merges)

- [ ] Manual run on `staging`: both matrix entries pass, the log shows no account ID and no finding list, and both categories appear in the Security tab.
- [ ] **Batch digest matches what prod ran.** Someone with prod access does this; the scan role can't, and shouldn't.
  - Simple, works any time: run `aws ecr describe-images` on the live color's repo. The chosen digest should have the most recent `lastRecordedPullTime`. Fargate pulls on every job, and ECR updates that field at least daily.
  - Strong: `aws batch describe-jobs` on a recent zipper job → `aws ecs describe-tasks` on its task → `containers[].imageDigest` should match. ECS keeps stopped tasks visible for only about an hour. If that can't be arranged in prod, do it in a lower environment, where the logic is the same.
- [ ] **CI image tag** is the one prod deploys use. Compare the scanned tag with the image in the last prod deploy log: CircleCI "Spin up environment" today, GitHub Actions "Initialize containers" after the migration. A mismatch right after a new version is published is expected (section 11).
- [ ] Record the evidence on the ticket for "correctly identifies the deployed images".
- [ ] Watch the first scheduled run: how long it takes, and whether a failure would be noticed (open decision 6).

## 8. Dependencies

**DAW-20 (now owned by someone else).** Agree this contract with them:
- [ ] A role in prod with:
  - `ecr:GetAuthorizationToken`
  - `ecr:BatchGetImage`, `ecr:GetDownloadUrlForLayer` and `ecr:DescribeImages` on `ef-cms-us-east-1` and `docket-entry-zipper-*-us-east-1`
  - `ssm:GetParameter` on `/DAWSON/*/current-color`
- [ ] A trust policy limited to `repo:ustaxcourt/ef-cms:environment:image-scan-prod`.
- [ ] GitHub Environment `image-scan-prod`: deployment branches `staging` only (add `prod` when the post-deploy hook arrives), no required reviewers.
- [ ] **Role ARN as environment secret `AWS_IMAGE_SCAN_ROLE_ARN`**, not a variable. This changes section 3 of [DAW-20-implementation-plan.md](DAW-20-implementation-plan.md).

**CircleCI → GitHub Actions migration.** Give that work these items:
- [ ] Reuse the GitHub OIDC provider DAW-20 creates; don't create a second one. Give the deploy its own role, not the scan role.
- [ ] Keep `switch-colors.sh` (or its replacement) as the only writer of `current-color`, in the same step that moves traffic.
- [ ] Add the post-deploy hook (5.7) once prod deploys run in GitHub Actions.

**Follow-up story: record the deployed images in SSM.** Replaces the "highest version tag" guess for the CI image with what the deploy actually used:
- [ ] After a successful deploy, write the image it used to `/DAWSON/<env>/ci-image`, ideally the digest (`ef-cms-us-east-1@sha256:…`), otherwise the tag.
- [ ] Change the `ci-image` branch of `resolve-deployed-image.sh` to read that parameter, and update its tests.
- [ ] DAW-20 role: add `ssm:GetParameter` on `/DAWSON/*/ci-image`.
- [ ] Optional: record the batch digest the same way, so the scan doesn't depend on `:latest`.

## 9. Out of scope

- Staging and dev scans (Mike's stories): a second caller of the same reusable workflow.
- The post-deploy hook itself: designed for here (5.7), wired up by the migration.
- Pinning the batch image to a version tag, AWS-side scanning (Inspector), the Puppeteer layer.

## 10. Open decisions

- [ ] **CI image after the migration:** will the GitHub Actions deploy jobs run inside `ef-cms-us-east-1`? If not, it stops being part of what prod depends on, and `ci-image` drops out of the scan.
- [ ] **Role ARN storage:** environment secret instead of variable (section 8)?
- [ ] **Account ID in the SARIF:** who can see code scanning alerts in this public repo? If that's too many people, add a step that strips the registry host before upload.
- [x] **CI image source of truth:** the highest version tag in ECR for now; the deploy records it in SSM in the follow-up story (section 8). CircleCI's config is not read.
- [ ] **Report-only:** keep `exit-code: 0`, like the other scans?
- [ ] **Failure alerts:** GitHub emails only the person who last edited the cron line. Who should hear when this job breaks?
- [ ] **Schedule:** share Monday 06:00 UTC with `trivy-baseline`, or stagger it?

## 11. Known limits

- The scan shows what the *next* batch job will pull. A job already running during a color switch may be on the previous image.
- `switch-colors.sh` turns traffic on for the new color a few lines before it updates SSM. A scan in that window gets the outgoing image; the next run corrects it. The post-deploy hook (5.7) runs after the switch finishes, so it avoids this.
- If the live image is lost to the 15-image lifecycle rule, the lookup fails by design.
- Until the SSM follow-up, the CI image scan is the newest version in ECR, not necessarily the one deploys use. Right after a new version is published to prod's ECR (before the deploy that adopts it), the scan is one version ahead. A version that was published but rolled back stays "highest" until a newer one replaces it.
