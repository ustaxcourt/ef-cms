<details><summary>Dependency Updates - Week of 2025-12-15</summary>

## Manual Deployment Steps

### Before Deployment

#### Docker container `4.3.62` - choose exp6

```bash
. scripts/env/set-env.zsh expN
npm run ecr:check-version
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
