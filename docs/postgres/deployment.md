
1. Merge PR into the desired branch, then install the latest NPM modules:
   ```bash
   git checkout branch-name
   git pull
   npm ci
   ```
1. Update the corresponding environment's secrets in AWS Secrets Manager to include the following:
   - POSTGRES_USER `${ENV}_dawson`
   - DATABASE_NAME `${ENV}_dawson`
   - POSTGRES_MASTER_USERNAME `master`
   - POSTGRES_MASTER_PASSWORD `${GENERATE_A_SECURE_PASS}` # we recommend 32+ character alphanumeric; no special characters
   - (optional) RDS_MIN_CAPACITY `1`
   - (optional) RDS_MAX_CAPACITY `32`
1. Use the [environment switcher](../additional-resources/environment-switcher.md) to point to the desired environment:
   ```bash
   source scripts/env/set-env.zsh ${ENV}
   ```
1. Run an account-specific terraform deployment to update the necessary CircleCI policies:
   ```bash
   npm run deploy:account-specific
   ```
1. Run an all-colors terraform deployment to create the RDS cluster with the master username and password:
   ```bash
   npm run deploy:allColors ${ENV}
   ```
1. Prepare the environment's deploy table:
   - migrate `true`
   - destination `<beta/alpha>` (set this to the opposite of the existing `source` value)
1. Install `psql`:
   ```bash
   brew update && brew install libpq
   ```
1. Determine the cluster's writeable endpoint:
   ```bash
   source scripts/postgres/get-host.sh --rw --quiet
   ```
1. Create the database users:
   ```bash
   cd scripts/postgres
   ./create-rds-users.sh
   ```
1. Run a deployment in CircleCI
