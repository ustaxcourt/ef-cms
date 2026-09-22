<details><summary>Dependency Updates - Week of 2026-09-22</summary>

## Local

#### Upgrade NodeJS to `24.21.0`
```bash
nvm install
nvm use
nvm alias default "$(cat .nvmrc)"
```

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.98`

This script will prompt for an environment to pull the image from; choose `exp7`.

```bash
npm run ecr:check-version
```

#### Aurora PostgreSQL `17.10` — experimental environment owners

Repo Postgres images are `17.10-bookworm`. If your cluster is not on `17.10` yet (e.g. exp2–exp6, exp8–exp9 on `17.5`; exp3 on `17.9`), upgrade **your** env only, one at a time:

1. `. scripts/env/set-env.zsh expN`
2. `scripts/secrets/update-secret.ts --key "RDS_ENGINE_VERSION" --value "17.10"`
3. Deploy **`court/experimentalN`**
4. During the CircleCI **`deploy`** job, follow [dependency-updates.md §5.1](docs/dependency-updates.md)

#### OpenSearch engine (§6)

No upgrade this rotation. AWS OpenSearch Service latest engine version is **OpenSearch_3.7**; local Docker and GitHub Actions already use **3.7.0**. No `ES_ENGINE_VERSION` change, indices report, or experimental deploy validation is required unless `aws opensearch list-versions` (from your exp env after assuming credentials) lists a version newer than **OpenSearch_3.7**.

## Caveats (still blocked or unchanged)

Documented in [dependency-updates.md](docs/dependency-updates.md) (notes stamped **9/22/2026** where applicable):

- **eslint 10** — still blocked by `eslint-plugin-jsx-a11y` / `eslint-plugin-react`; remain on **9.39.5** with `@eslint/js`.
- **@babel 8** — blocked by `esbuild-plugin-babel-cached` and `ts-jest` peers; remain on **7.29.7**.
- **@joi/date 3** — blocked ([#10383](https://github.com/ustaxcourt/ef-cms/issues/10383)); remain on **2.1.1**.
- **Cerebral** stack and **babel-plugin-cerebral** — unchanged.
- **Quill 1.3.7** / **quill-delta-to-html 0.12.1** — unchanged (Word editor migration).
- **DWT** — unchanged (**19.4.3**); not part of weekly npm rotation.
- **@fortawesome** — vulnerability-only; unchanged.
- **pdfjs-dist** — unchanged (**6.3.289**); no Lambda PDF re-validation required this rotation.
- **Puppeteer 25.11.0** / **@sparticuz/chromium 153.0.0** — already latest; root and `web-api/runtimes/puppeteer` stay aligned.
- **@types/node 24.13.6** — latest under major 24; still does not match Node **24.21.0** patch (known).
- **TypeScript** dual alias (**7.0.2** / **6.0.2**) and batch Dockerfile global install — unchanged.

After pulling this branch locally, run `npm ci` at the repo root, then `npm ci` in `web-api/runtimes/puppeteer` and `web-api/terraform/modules/batch/docker-image` if lockfiles changed.

</details>
<details><summary>Dependency Updates - Week of 2026-09-14</summary>

## Local

#### Upgrade Terraform to `1.16.3`
use either tfswitch or tfenv
```bash
tfswitch 1.16.3
```
```bash
tfenv install 1.16.3
tfenv use 1.16.3
```

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.97`

This script will prompt for an environment to pull the image from; choose `exp8`.

```bash
npm run ecr:check-version
```

</details>
<details><summary>Fix stale automaticBlocked on cases set for trial</summary>

## Manual Deployment Steps

### After Deployment

Cases that were automatically blocked before being set for trial kept a stale
`automaticBlocked` flag, because the recompute was skipped whenever the case had
a trial date. This excluded them from trial eligibility and left them on the
Blocked Cases Report. Run the following to recompute those cases:

```bash
# Preview the cases that will be updated
./scripts/run-once-scripts/fix-stale-automatic-blocks.ts --dry-run

# Apply the fix
./scripts/run-once-scripts/fix-stale-automatic-blocks.ts
```
</details>

<details><summary>Dependency Updates - Week of 2026-09-08</summary>

## Local

#### Upgrade Terraform to `1.16.2`
use either tfswitch or tfenv
```bash
tfswitch 1.16.2
```
```bash
tfenv install 1.16.2
tfenv use 1.16.2
```

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.96`

This script will prompt for an environment to pull the image from; choose `exp2`.

```bash
npm run ecr:check-version
```

</details>
<details><summary>Dependency Updates - Week of 2026-08-31</summary>

## Local

#### Upgrade NodeJS to `24.20.0`
```bash
nvm install
nvm use
nvm alias default "$(cat .nvmrc)"
```

#### Upgrade Terraform to `1.16.1`
use either tfswitch or tfenv
```bash
tfswitch 1.16.1
```
```bash
tfenv install 1.16.1
tfenv use 1.16.1
```

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.95`

This script will prompt for an environment to pull the image from; choose `exp8`.

```bash
npm run ecr:check-version
```

</details>
<details><summary>10266 - Restrict frontend S3 buckets to CloudFront-only access</summary>

## Manual Deployment Steps

### Before Deployment

#### Deploy account-specific Terraform

```bash
npm run deploy:account-specific
```
</details>
<details><summary>Dependency Updates - Week of 2026-08-24</summary>

## Local

#### Upgrade Terraform to `1.15.9`
use either tfswitch or tfenv
```bash
tfswitch 1.15.9
```
```bash
tfenv install 1.15.9
tfenv use 1.15.9
```

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.94`

This script will prompt for an environment to pull the image from; choose `exp5`.

```bash
npm run ecr:check-version
```
</details>
<details><summary>Revert @joi/date 3.0.0 upgrade</summary>

## Local

#### Reinstall dependencies

`@joi/date` was pinned back to **2.1.1**. Run `npm ci` after pulling so the stale ESM `@joi/date` 3.0.0 tree in `node_modules` is replaced.

```bash
npm ci
```

</details>
<details><summary>10170/10199 - Enable new and consolidated trial locations</summary>

## Manual Deployment Steps

### After Deployment

Do not enable this feature before the last weekend in August 2026. After both
stories are deployed, and no later than September 8, 2026, enable the five new
trial cities, consolidated petition trial-location menus, and
procedure-neutral Order Designating Place of Trial by running:

```bash
./scripts/postgres/featureFlags/setup-new-trial-cities.ts
```
</details>
<details><summary>Dependency Updates - Week of 2026-08-17</summary>

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.93`

This script will prompt for an environment to pull the image from; choose `exp7`.

```bash
npm run ecr:check-version
```

#### OpenSearch 3.5 → 3.7 engine upgrade

Run the OpenSearch indices report and note the indices and aliases in the target environment:

```bash
. scripts/env/set-env.zsh {YOUR_ENV}
scripts/reports/indices.ts
```

Set the value of the `ES_ENGINE_VERSION` secret in the `[env]_deploy` secrets in Secrets Manager to `OpenSearch_3.7`:

```bash
scripts/secrets/update-secret.ts --key "ES_ENGINE_VERSION" --value "OpenSearch_3.7"
```

Deploy to the environment. While the OpenSearch upgrade is being performed (during the `allColors` terraform deployment), verify the cluster is still functional by running search smoketests against the current color:

```bash
scripts/tests/run-cypress.ts --file cypress/deployed-and-local/integration/advancedSearch/search.cy.ts
```

After the deployment's `cleanup` job is finished, rerun the OpenSearch indices report and ensure that all indices are present and populated, and that the aliases are configured as expected:

```bash
scripts/reports/indices.ts
```

#### PROD & TEST ONLY! Set the value of the `ES_LOGS_ENGINE_VERSION` secret in the `account_deploy` secrets in Secrets Manager to `OpenSearch_3.7`

```bash
ENV=account scripts/secrets/update-secret.ts --key "ES_LOGS_ENGINE_VERSION" --value "OpenSearch_3.7"
```

#### PROD & TEST ONLY! Run an `account-specific` terraform deployment

```bash
npm run deploy:account-specific
```
</details>
<details><summary>Dependency Updates - Week of 2026-08-10</summary>

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.92`

This script will prompt for an environment to pull the image from; choose `exp7`.

```bash
npm run ecr:check-version
```
</details>
<details><summary>Payment Portal Integration</summary>

## Manual Deployment Steps

### Before Deployment

#### Add Payment Portal Secrets
__ADD THESE OR YOUR DEPLOYMENTS WILL FAIL__
```bash
# Secret values can be gotten off of exp2
. ./scripts/env/set-env.zsh {YOUR_ENV}
./scripts/secrets/update-secret.ts -k PAYMENT_PORTAL_ARN -v {VALUE}
./scripts/secrets/update-secret.ts -k PAYMENT_PORTAL_HOST -v {VALUE}
./scripts/secrets/update-secret.ts -k PAY_GOV_ORIGIN -v {VALUE}
```
### After Deployment
Run this to enable payment portal integration
```bash
./scripts/postgres/featureFlags/setup-enable-payment-portal-integration.ts
```
</details>
<details><summary>Dependency Updates - Week of 2026-08-03</summary>

## Local
#### Upgrade NodeJS to `24.19.0`
```bash
nvm install
nvm use
nvm alias default "$(cat .nvmrc)"
```

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.91`

This script will prompt for an environment to pull the image from; choose `exp6`.

```bash
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-07-27</summary>

## Local
#### Upgrade NodeJS to `24.18.1`
```bash
nvm install
nvm use
nvm alias default "$(cat .nvmrc)"
```

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.90`

This script will prompt for an environment to pull the image from; choose `exp6`.

```bash
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-07-20</summary>

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.89`

This script will prompt for an environment to pull the image from; choose `exp3`.

```bash
npm run ecr:check-version
```
</details>
<details><summary>Install gitleaks</summary>

## Local

#### Install gitleaks (secrets scanning) for the pre-commit hook
```bash
brew update && brew install gitleaks
```
</details>
<details><summary>Updating batch job roles/permissions</summary>

## Manual Deployment Steps

### Before Deployment

#### Run an `account-specific` terraform deployment
```bash
npm run deploy:account-specific
```
</details>
<details><summary>Dependency Updates - Week of 2026-07-13</summary>

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.88`

This script will prompt for an environment to pull the image from; choose `exp3`.

```bash
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-07-06</summary>

## Local

#### Upgrade Terraform to `1.15.8`
use either tfswitch or tfenv
```bash
tfswitch 1.15.8
```
```bash
tfenv install 1.15.8
tfenv use 1.15.8
```

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.87`

This script will prompt for an environment to pull the image from; choose `exp6`.

```bash
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-06-29</summary>

## Local

#### Upgrade NodeJS to `24.18.0`
```bash
nvm install
nvm use
nvm alias default "$(cat .nvmrc)"
```

#### Upgrade Terraform to `1.15.7`
use either tfswitch or tfenv
```bash
tfswitch 1.15.7
```
```bash
tfenv install 1.15.7
tfenv use 1.15.7
```

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.86`

This script will prompt for an environment to pull the image from; choose `exp3`.

```bash
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-06-22</summary>

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.85`

This script will prompt for an environment to pull the image from; choose `exp8`.

```bash
npm run ecr:check-version
```

</details>
<details><summary>Dependency Updates - Week of 2026-06-15</summary>

## Local

#### Upgrade Terraform to `1.15.6`
use either tfswitch or tfenv
```bash
tfswitch 1.15.6
```
```bash
tfenv install 1.15.6
tfenv use 1.15.6
```

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.84`

This script will prompt for an environment to pull the image from; choose `exp5`.

```bash
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-06-08</summary>

## Local

#### Upgrade Terraform to `1.15.5`
use either tfswitch or tfenv
```bash
tfswitch 1.15.5
```
```bash
tfenv install 1.15.5
tfenv use 1.15.5
```

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.83`

This script will prompt for an environment to pull the image from; choose `exp4`.

```bash
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-06-01</summary>

## Manual Deployment Steps

### Before Deployment

#### Deploy Docker container `4.3.82`

This script will prompt for an environment to pull the image from; choose `exp7`.

```bash
npm run ecr:check-version
```
</details>
<details><summary>Install Recommended VS Code Extensions</summary>

## Local

### Install recommended VS Code Extensions

1. In VS Code, press `Command + Shift + P` to open the Command Palette
2. Search and select **Shell Command: Install 'code' command in PATH**
3. Run the following in your terminal:
   ```bash
   cat .vscode/extensions.json | jq -r '.recommendations[]' | xargs -n 1 code --install-extension

   npm ci
   ```
4. Press `Command + Shift + P`, search for `Developer: Reload Window`, and select it so the workspace, TypeScript SDK, and extensions reload cleanly.

</details>
<details><summary>Dependency Updates - Week of 2026-05-25</summary>

## Local

#### Upgrade NodeJS to `24.16.0`
```bash
nvm install
nvm use
nvm alias default "$(cat .nvmrc)"
```

</details>
<details><summary>Dependency Updates - Week of 2026-05-18</summary>

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.80` - choose exp3
```bash
npm run ecr:check-version
```

#### Upgrade Terraform to `1.15.4`
use either tfswitch or tfenv
```bash
tfswitch 1.15.4
```
```bash
tfenv install 1.15.4
tfenv use 1.15.4
```

</details>
<details><summary>PDF Generator IAM Scoping</summary>

## Manual Deployment Steps

### Before Deployment

#### Run an `account-specific` terraform deployment
```bash
npm run deploy:account-specific
```
</details>
<details><summary>Dependency Updates - Week of 2026-05-11</summary>

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.79` - choose exp3
```bash
npm run ecr:check-version
```

#### Upgrade Terraform to `1.15.3`
use either tfswitch or tfenv
```bash
tfswitch 1.15.3
```
```bash
tfenv install 1.15.3
tfenv use 1.15.3
```

</details>
<details><summary>Dependency Updates - Week of 2026-05-04</summary>

## Manual Deployment Steps

### Before Deployment

#### Upgrade Terraform to `1.15.1`
use either tfswitch or tfenv
```bash
tfswitch 1.15.1
```
```bash
tfenv install 1.15.1
tfenv use 1.15.1
```

</details>

<details><summary>Dependency Updates - Week of 2026-04-27</summary>

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.77` - choose exp7
```bash
npm run ecr:check-version
```

#### Upgrade Terraform to `1.15.0`

```bash
tfswitch 1.15.0
```

</details>
<details><summary>Support `--aws-only` Flag in the Environment Switcher</summary>

## Local

#### Migrate Local Environment Scripts to Support the `--aws-only` Flag

```bash
./scripts/run-once-scripts/migrate-environments.zsh
```
</details>
<details><summary>Dependency Updates - Week of 2026-04-20</summary>
## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.76` - choose exp5
```bash
npm run ecr:check-version
```

## Local

#### Upgrade NodeJS to `24.15.0`
```bash
nvm install
nvm use
nvm alias default "$(cat .nvmrc)"
```
</details>
<details><summary>Dependency Updates - Week of 2026-04-13</summary>

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.75` - choose exp4
```bash
npm run ecr:check-version
```
</details>
<details><summary>9764 - Zero-Downtime Postgres Upgrades</summary>

## Manual Deployment Steps

### Before Deployment

#### Run an `account-specific` terraform deployment
```bash
npm run deploy:account-specific
```
</details>
<details><summary>Dependency Updates - Week of 2026-04-06</summary>

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.74` - choose exp2
```bash
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-03-30</summary>

## Local

#### Upgrade NodeJS to `24.14.1`
```bash
nvm install
nvm use
nvm alias default "$(cat .nvmrc)"
```

#### Upgrade Terraform to `1.14.8`

```bash
tfswitch 1.14.8
```

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.73` - choose exp4
```bash
npm run ecr:check-version
```

#### Set the value of the `ES_ENGINE_VERSION` secret in the [env]_deploy secrets in Secrets Manager to `OpenSearch_3.5`
```bash
scripts/secrets/update-secret.ts --key "ES_ENGINE_VERSION" --value "OpenSearch_3.5"
```

#### PROD & TEST ONLY! Set the value of the `ES_LOGS_ENGINE_VERSION` secret in the `account_deploy` secrets in Secrets Manager to `OpenSearch_3.5`
```bash
ENV=account scripts/secrets/update-secret.ts --key "ES_LOGS_ENGINE_VERSION" --value "OpenSearch_3.5"
```

#### PROD & TEST ONLY! Run an `account-specific` terraform deployment
```bash
npm run deploy:account-specific
```
</details>
<details><summary>Dependency Updates - Week of 2026-03-16</summary>

## Local

#### Upgrade Terraform to `1.14.7`

```bash
tfswitch 1.14.7
```

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.72` - choose exp7
```bash
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-03-09</summary>

## Local

#### Upgrade NodeJS to `24.14.0`
```bash
nvm install
nvm use
nvm alias default "$(cat .nvmrc)"
```

#### Upgrade Terraform to `1.14.6`

```bash
tfswitch 1.14.6
```

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.71` - choose exp2
```bash
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-02-23</summary>

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.69` - choose exp2
```bash
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-02-16</summary>

## Local

#### Upgrade NodeJS to `24.13.1`
```bash
nvm install
nvm use
nvm alias default "$(cat .nvmrc)"
```

#### Upgrade Terraform to `1.14.5`

```bash
tfswitch 1.14.5
```

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.68` - choose exp4

```bash
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-02-09</summary>

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.67` - choose exp5

```bash
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-02-02</summary>

## Local

#### Upgrade NodeJS to `24.13.0`

```bash
nvm install
nvm use
nvm alias default "$(cat .nvmrc)"
```

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.66` - choose exp7

```bash
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-01-27</summary>

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.65` - choose exp7

```bash
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-01-05</summary>

## Local

#### Upgrade Terraform to `1.14.3`

```bash
tfswitch 1.14.3
```

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.63` - choose exp2

```bash
npm run ecr:check-version
```
</details>
<details><summary>BUG 9609</summary>

## Manual Deployment Steps

#### Run an account-specific terraform deployment

```bash
npm run deploy:account-specific
```
</details>
<details><summary>Dependency Updates - Week of 2025-12-15</summary>

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.62` - choose exp6

```bash
npm run ecr:check-version
```
</details>
<details><summary>DynamoDB Removal</summary>

## Local

#### Remove local DynamoDB installation

```bash
rm -rf .dynamodb
```
</details>
<details><summary>Dependency Updates - Week of 2025-12-08</summary>

## Local

#### Upgrade NodeJS to `24.12.0`

```bash
nvm install
nvm use
nvm alias default "$(cat .nvmrc)"
```

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.61` - choose exp6

```bash
npm run ecr:check-version
```

</details>
<details><summary>Dependency Updates - Week of 2025-12-01</summary>

## Local

#### Upgrade NodeJS to `24.11.1`

```bash
nvm install
nvm use
nvm alias default "$(cat .nvmrc)"
```

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.60` - choose exp3

```bash
npm run ecr:check-version
```

</details>
<details><summary>Dependency Updates - Week of 2025-11-24</summary>

## Manual Deployment Steps

### Before Deployment

#### Deploy docker container `4.3.59` from exp5

```bash
npm run deploy:ci-image:from exp5
```

#### Set the value of the `ES_ENGINE_VERSION` secret in the [env]_deploy secrets in Secrets Manager to `OpenSearch_3.3`

```bash
scripts/secrets/update-secret.ts --key "ES_ENGINE_VERSION" --value "OpenSearch_3.3"
```

#### PROD & TEST ONLY! Set the value of the `ES_LOGS_ENGINE_VERSION` secret in the `account_deploy` secrets in Secrets Manager to `OpenSearch_3.3`

```bash
ENV=account scripts/secrets/update-secret.ts --key "ES_LOGS_ENGINE_VERSION" --value "OpenSearch_3.3"
```

#### PROD & TEST ONLY! Run an `account-specific` terraform deployment

```bash
npm run deploy:account-specific
```

</details>
