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
. scripts/env/set-env.zsh expN
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
. scripts/env/set-env.zsh expN
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-02-23</summary>

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.69` - choose exp2
```bash
. scripts/env/set-env.zsh expN
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
. scripts/env/set-env.zsh expN
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-02-09</summary>

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.67` - choose exp5

```bash
. scripts/env/set-env.zsh expN
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
. scripts/env/set-env.zsh expN
npm run ecr:check-version
```
</details>
<details><summary>Dependency Updates - Week of 2026-01-27</summary>

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.65` - choose exp7

```bash
. scripts/env/set-env.zsh expN
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
. scripts/env/set-env.zsh expN
npm run ecr:check-version
```
</details>
<details><summary>BUG 9609</summary>

## Manual Deployment Steps

#### Run an account-specific terraform deployment

```bash
. scripts/env/set-env.zsh expN
npm run deploy:account-specific
```
</details>
<details><summary>Dependency Updates - Week of 2025-12-15</summary>

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.62` - choose exp6

```bash
. scripts/env/set-env.zsh expN
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
. scripts/env/set-env.zsh expN
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
. scripts/env/set-env.zsh expN
npm run ecr:check-version
```

</details>
<details><summary>Dependency Updates - Week of 2025-11-24</summary>

## Manual Deployment Steps

### Before Deployment

#### Deploy docker container `4.3.59` from exp5

```bash
. scripts/env/set-env.zsh expN
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
