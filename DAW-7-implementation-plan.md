# DAW-7 implementation plan

Three PRs, ordered so the AC4 before/after numbers hold up.

## 0. Baseline (AC4)

- [ ] Record open high and critical alerts, plus unique CVEs, for `trivy-baseline-base` and `trivy-baseline-batch` on `staging`. The `gh api` command from the triage doc does this. Paste the numbers into DAW-7.
- [ ] After step 1's first `staging` run, record the batch baseline again, because the scan will cover more than before.

## 1. Scan what actually ships (PR 1: `security-containers.yml`)

- [ ] **Batch:** in `trivy-runtime-base` and `trivy-baseline`, replace the step that reads the `FROM` line with an actual build, then scan the result:
  ```bash
  docker build --platform linux/amd64 \
    --build-arg AWS_REGION=us-east-1 --build-arg WEBSOCKET_API_GATEWAY_ID=scan-placeholder \
    -t docket-entry-zipper:scan web-api/terraform/modules/batch/docker-image
  ```
  Keep the category names (`trivy-image-batch`, `trivy-baseline-batch`) so alert history carries over.
- [ ] Add `web-api/terraform/modules/batch/docker-image/**` to both the push `paths:` and `IMAGE_PATHS`. Batch's code and lockfile now change scan results, and the file says to keep the two lists in sync.
- [ ] **Puppeteer:** stop scanning it, both the matrix entry and the baseline step.
  - The image never ships. CircleCI deploys build the layer with [build.sh](web-api/runtimes/puppeteer/build.sh), without Docker. Deploys run from a developer's machine use the image through `build-local.sh` ([deploy-app-color.sh](web-api/terraform/bin/deploy-app-color.sh), lines 90–93), copy the zip out, and delete the container.
  - Only the zip reaches Lambda, and its contents come from `package-lock.json`, which the full-tree scan already covers.
  - The category has only 7 open alerts, so this is about signal more than numbers.
  - Get team agreement first, then dismiss its existing alerts, which won't close on their own. The alternative is to keep the scan and treat its findings as build-only.
- [ ] Update the scanning-coverage notes in [container-scanning.md](docs/security/container-scanning.md) and [container-findings-triage.md](docs/security/container-findings-triage.md).
- **Verify:** start the workflow by hand. Batch alerts should now include `awscli` and the global `ts-node`.

## 2. Main image (PR 2: root `Dockerfile`)

**Layer cleanup (AC3):**

- [ ] Merge `apt-get update` (line 9) and the three install steps (lines 11–33) into one `RUN` with `--no-install-recommends`, ending in `rm -rf /var/lib/apt/lists/*`.
- [ ] AWS CLI (lines 36–39): also `rm -rf aws`. The extracted installer folder is currently left behind.
- [ ] Terraform (lines 41–44): change `cp` to `mv`. That removes the second copy at `/home/app/terraform` and its 11 duplicate alerts.

**Removing unneeded packages (AC2):**

- [ ] **Java:** remove the four `openjdk` packages, `JAVA_HOME`, and the `mkdir /usr/share/man/man1` workaround (line 7). Nothing outside the Dockerfile and docs references Java. It's probably left over from DynamoDB Local, which was removed. If CI passes without it, also consider dropping OpenJDK from `running-locally.md` (separate decision).
- [ ] Drop `wget`. It's only used for the Terraform download, and `curl` is already installed.
- [ ] Check whether anything uses `sudo`, `less` or `python3-dev`.
- [ ] Keep `build-essential` and the `-dev` libraries for `node-canvas`. CI's `npm ci` needs them.
- [ ] Pin `cypress/browsers` by digest here, so the image only needs one tag bump (see step 4).

**Release:**

- Bump the tag in [.circleci/config.yml](.circleci/config.yml) (line 5) and push with [docker-to-ecr.sh](scripts/ecr/docker-to-ecr.sh), which needs AWS credentials.
- Check a full CI run on the new tag, especially the PDF workflows. `--no-install-recommends` can drop fonts that Ghostscript or GraphicsMagick relied on.
- `Dockerfile-local` builds from this image, so check the local stack too.

## 3. Batch image (PR 3, AC2 and AC3)

- [ ] **Base:** `node:24.21.0-trixie-slim`. That names the Debian release explicitly and matches the CI image's Debian 13.
- [ ] **Remove `awscli`.** The job imports only the AWS SDK, `fflate` and Node built-ins, never shells out, and its job definition has no command override. Confirm nobody uses it for debugging inside the container.
- [ ] **Replace the global `ts-node`/`typescript`.** Two options:
  - **A:** `CMD ["node", "src/docketEntryBatchDownloader.ts"]`, using Node 24's built-in TypeScript type stripping. On `node:24.21.0-slim` the file parsed and failed only at the missing `@aws-sdk` package. It still needs a full run with dependencies installed.
  - **B:** a two-stage build: compile with `tsc` in a build stage, then run `node dist/docketEntryBatchDownloader.js` in a slim final stage.
- [ ] Run `npm ci --omit=dev && npm cache clean --force` as a single `RUN`. The only dev dependency is `@types/node`.
- [ ] Add a `.dockerignore` excluding `node_modules`, `deploy-to-ecr.sh` and `check-env-variables.sh`. That folder has none, so `COPY . .` currently copies everything.
- [ ] Pin `node` by digest.
- **Verify:** `npm run deploy:zipper` to an experimental environment, then run a batch download end to end.

## 4. Pinning by digest (AC1, done inside PR 2 and PR 3)

- [ ] Write `FROM <tag>@sha256:<digest>`, keeping the tag for readability. Get the digest with `docker buildx imagetools inspect <tag>`.
- [ ] Pin the puppeteer Dockerfile too, even if its scan is dropped. Deploys from a developer's machine build the production layer inside it, so digest pinning is what protects that build.
- [ ] Skip `Dockerfile-local`, which builds from our own local image.
- [ ] The repo has no Dependabot or Renovate, so add a "refresh digests" step to the weekly routine in [dependency-updates.md](docs/dependency-updates.md).

## 5. Measure and close out (AC4)

- [ ] After each PR reaches `staging`, compare against the baseline: high and critical alerts, and unique CVEs, per image, before and after.
- [ ] Attach the final table to DAW-7.

## Open questions to settle early

- Does the team agree to stop scanning the puppeteer image?
- Is Java safe to remove?
- Is `awscli` really unused in batch?
- Option A or B for running the batch TypeScript?
