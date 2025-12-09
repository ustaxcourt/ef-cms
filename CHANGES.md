###Update NodeJS 
```bash
nvm install
nvm use
that other one
```

- [x] Deploy docker container `4.3.59` to the production ECR:
   ```bash
   . scripts/env/set-env.zsh prod
   npm run deploy:ci-image
   ```

- [x] Run script to populate a missing page count for some docket entries:
   ```bash
   scripts/run-once-scripts/fix-null-page-counts.ts
   ```

- [x] Set the value of the `ES_ENGINE_VERSION` secret in the `prod_deploy` secrets in Secrets Manager to `OpenSearch_3.3`
   ```bash
   scripts/secrets/update-secret.ts --key "ES_ENGINE_VERSION" --value "OpenSearch_3.3"
   ```

- [x] Set the value of the `ES_LOGS_ENGINE_VERSION` secret in the `account_deploy` secrets in Secrets Manager to `OpenSearch_3.3`
   ```bash
   ENV=account scripts/secrets/update-secret.ts --key "ES_LOGS_ENGINE_VERSION" --value "OpenSearch_3.3"
   ```

- [x] Run an `account-specific` deployment
    - will delete and recreate some resources that are now conditional - ensure that these resources are recreated
    - will update the OpenSearch `info` cluster's engine to version `3.3` (takes ~30m)
   ```bash
   . scripts/env/set-env.zsh prod
   npm run deploy:account-specific
   ```

- [x] Run an `account-specific` deployment
    - will delete and recreate some resources that are now conditional - ensure that these resources are recreated
    - will update the OpenSearch `info` cluster's engine to version `3.3` (takes ~30m)
   ```bash
   . scripts/env/set-env.zsh prod
   npm run deploy:account-specific
   ```

scripts/run-once-scripts/fix-null-page-counts.ts
npm run deploy:account-specific
ENV=account scripts/secrets/update-secret.ts --key "ES_LOGS_ENGINE_VERSION" --value "OpenSearch_3.3"
