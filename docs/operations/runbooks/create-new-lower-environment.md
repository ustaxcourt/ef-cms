# Creating a New Lower Environment in an Empty AWS Account

## Description

This runbook describes the process of creating a new DAWSON lower environment in an otherwise empty AWS account.

## ⚠️ Caution ⚠️

Proceed with the expectation that this runbook is out of date. Carefully inspect every command and script herein, cross-referencing operational environments, before running. Update this document as necessary.

## Preqrequisites
- New AWS account
  - DAWSON AWS accounts should be named in the following convention: `dawson-workloads-[env]`
- SSO user that is able to assume an admin role in the new AWS account
- You should know ahead of time if this environment will have prod-like data
- Some secrets:
  - Dmarc Policy for outgoing email (string)
  - Production AWS account ID (number)
  - Production documents bucket name (string)
  - ARN of the external flexion developer role (string)
  - Additional secrets for environments with prod-like data:
    - Days to keep logs in Kibana (number)
    - Nodes in the Opensearch cluster for Kibana (number)
    - Opensearch instance type for Kibana (string)
    - Opensearch volume size for Kibana (number)
    - IRS superuser email address for prod-like email (email address)
    - Nodes in the efcms-search-[env]* Opensearch cluster (number)
    - Opensearch instance type for the main efcms-search-[env]* Opensearch cluster (string)
    - Volume size for prod-like Opensearch instances (number)
    - Maximum capacity for prod-like RDS clusters (string) [eg. "0.9"]
    - Minimum capacity for prod-like RDS clusters (string) [eg. "0.1"]
    - RUM sample rate for requests (string) [eg. "0.99"]

## Steps
1. Create a block in your `~/.aws/config` file for the new account:
   1. Open the `~/.aws/config` file in your text editor of choice
   1. Paste the following configuration block, populating the values appropriately:
      ```pycon
      [profile ustc-exp9]
      sso_start_url = <SSO URL>
      sso_region = us-east-1
      sso_account_id = <ACCOUNT ID>
      sso_role_name = <SSO ROLE>
      region = us-east-1
      ```
   1. Save the file
1. Start a fresh terminal session which does not have any DAWSON-related environment variables exported
1. Export an `ENV` variable using the shorthand name of this new environment:
   ```bash
   export ENV="exp9"
   ```
1. Export an `AWS_PROFILE` variable matching the exact name of the profile you added earlier:
   ```bash
   export AWS_PROFILE="ustc-exp9"
   ```
1. Establish an AWS SSO session:
   ```bash
   aws sso login
   ```
1. Create the `account_deploy` secrets for this environment, populating the values appropriately:
   1. Lower environment:
      ```bash
      scripts/secrets/create-account-secrets.ts \
        --domain "ustaxcourt.gov" \
        --env "$ENV" \
        --external-trusted-role-arn "<Flexion-Developer ARN>"
      ```
   1. Lower environment with prod-like data:
      ```bash
      scripts/secrets/create-account-secrets.ts \
        --domain "ustaxcourt.gov" \
        --env "$ENV" \
        --external-trusted-role-arn "<Flexion-Developer ARN>" \
        --log-expiration-days <LOWER ENV LOG EXIRATION DAYS> \
        --opensearch-logs-instance-count <LOWER ENV LOG INSTANCE COUNT> \
        --opensearch-logs-instance-type "<LOWER ENV LOG INSTANCE TYPE>" \
        --opensearch-logs-volume-size <LOWER ENV LOG VOLUME SIZE GB>
      ```
1. Create the `[env]_deploy` secrets for this environment, populating the values appropriately:
   1. Lower environment:
      ```bash
      scripts/secrets/create-env-secrets.ts \
        --domain "ustaxcourt.gov" \
        --email-dmarc-policy "<DMARC POLICY>" \
        --enable-email \
        --enable-health-checks \
        --env "$ENV" \
        --prod-account-id "<PROD ACCOUNT ID>" \
        --prod-documents-bucket "<PROD DOCUMENTS BUCKET NAME>"
      ```
   1. Lower environment with prod-like data:
      ```bash
      scripts/secrets/create-env-secrets.ts \
        --admin-user-email "<ADMIN USER EMAIL>" \
        --domain "ustaxcourt.gov" \
        --email-dmarc-policy "<DMARC POLICY>" \
        --enable-dynamsoft \
        --enable-email \
        --enable-health-checks \
        --env "$ENV" \
        --generate-secure-default-account-password \
        --irs-superuser-email "<IRS SUPERUSER EMAIL>" \
        --opensearch-instance-count <PROD-LIKE INSTANCE COUNT> \
        --opensearch-instance-type "<PROD-LIKE INSTANCE TYPE>" \
        --opensearch-volume-size <PROD-LIKE VOLUME SIZE> \
        --prod-account-id "<PROD ACCOUNT ID>" \
        --prod-documents-bucket "<PROD DOCUMENTS BUCKET NAME>" \
        --rds-max-capacity <PROD-LIKE MAX CAPACITY> \
        --rds-min-capacity <PROD-LIKE MIN CAPACITY> \
        --rum-sample-rate <RUM SAMPLE RATE>
      ```
1. Create Cloudwatch log groups:
   ```bash
   scripts/cloudwatch/create-missing-log-groups.sh "$ENV"
   ```
1. Run an `account-specific` terraform deployment:
   ```bash
   npm run deploy:account-specific
   ```
1. Set up a CircleCI context for this environment:
   1. Export the AWS account id in your terminal session:
      ```bash
      export AWS_ACCOUNT_ID="<AWS ACCOUNT ID>"
      ```
   1. Assume the `dawson_dev` role:
      ```bash
      . scripts/env/assume-role.zsh
      ```
   1. Generate an IAM token for the CircleCI user, being sure to copy the output to a scratch file so it is not lost:
      ```bash
      npm run secrets:rotate-circleci
      ```
   1. Navigate to the organization's [CircleCI contexts](https://app.circleci.com/settings/organization/github/ustaxcourt/contexts) and click "Create Context"
   1. Name this context (eg. `efcms-experimatal9`) and click "Create Context"
   1. Click on the newly-created context
   1. Add environment variables for the AWS credentials:
      1. Add an `AWS_ACCESS_KEY_ID` environment variable:
         1. Click "Add environment variable"
            1. Environment variable name: `AWS_ACCESS_KEY_ID`
            1. Value: Enter the value from the output you copied earlier
            1. Click "Add environment variable"
      1. Add an `AWS_SECRET_ACCESS_KEY` environment variable:
         1. Click "Add environment variable"
            1. Environment variable name: `AWS_SECRET_ACCESS_KEY`
            1. Value: Enter the value from the output you copied earlier
            1. Click "Add environment variable"
1. Become the CircleCI user
   ```bash
   unset AWS_PROFILE
   export AWS_ACCESS_KEY_ID=<CIRCLECI AWS_ACCESS_KEY_ID>
   export AWS_SECRET_ACCESS_KEY=<CIRCLECI AWS_SECRET_ACCESS_KEY>
   ```
1. Run an `allColors` terraform deployment:
   ```bash
   export CURRENT_COLOR=blue
   export DEPLOYING_COLOR=green
   export SOURCE_TABLE="efcms-${ENV}-alpha"
   export DESTINATION_TABLE="efcms-${ENV}-alpha"
   npm run deploy:allColors "$ENV"
   ```
1. TODO: Troubleshooting - add descriptive instructions to overcome the following
   1. ACM cert validation timeout: After the `NS` record is generated for `[env].[repo].[domain]`, copy it to the AWS account that owns the `[domain]` hosted zone
   1. Cognito pool creation error: After SES identity is created, run `web-api/verify-ses-email.sh`
   1. Some S3 buckets need to have "Block all public access" disabled:
      1. S3 -> [bucket] -> Permissions -> Block public access -> Edit -> Uncheck "Block all public access"
   1. API Gateway Stage: CloudWatch Logs role ARN must be set in account settings to enable logging:
      1. API Gateway -> Settings -> Logging -> Edit -> CloudWatch log role ARN: `arn:aws:iam::<ACCOUNT ID>:role/api_gateway_cloudwatch_global`
1. Run a color-specific terraform deployment for green:
   ```bash
   npm run "deploy:${DEPLOYING_COLOR}" "$ENV"
   ```
1. Run a color-specific terraform deployment for blue:
   ```bash
   export CURRENT_COLOR=green
   export DEPLOYING_COLOR=blue
   npm run "deploy:${DEPLOYING_COLOR}" "$ENV"
   ```
1. Write configuration to the deploy table:
   1. `current-color`:
      ```bash
      aws dynamodb update-item \
        --region us-east-1 --table-name "efcms-deploy-${ENV}" \
        --key '{"pk":{"S":"current-color"}, "sk":{"S":"current-color"}}' \
        --update-expression "SET #current = :current" \
        --expression-attribute-names '{"#current":"current"}' \
        --expression-attribute-values '{":current":{"S":"blue"}}'
      ```
   1. `destination-table-version`:
      ```bash
      aws dynamodb update-item \
        --region us-east-1 --table-name "efcms-deploy-${ENV}" \
        --key '{"pk":{"S":"destination-table-version"}, "sk":{"S":"destination-table-version"}}' \
        --update-expression "SET #current = :current" \
        --expression-attribute-names '{"#current":"current"}' \
        --expression-attribute-values '{":current":{"S":"alpha"}}'
      ```
   1. `migrate`:
      ```bash
      aws dynamodb update-item \
        --region us-east-1 --table-name "efcms-deploy-${ENV}" \
        --key '{"pk":{"S":"migrate"}, "sk":{"S":"migrate"}}' \
        --update-expression "SET #current = :current" \
        --expression-attribute-names '{"#current":"current"}' \
        --expression-attribute-values '{":current":{"BOOL":false}}'
      ```
   1. `migration-queue-empty`:
      ```bash
      aws dynamodb update-item \
        --region us-east-1 --table-name "efcms-deploy-${ENV}" \
        --key '{"pk":{"S":"migration-queue-empty"}, "sk":{"S":"migration-queue-empty"}}' \
        --update-expression "SET #current = :current" \
        --expression-attribute-names '{"#current":"current"}' \
        --expression-attribute-values '{":current":{"BOOL":true}}'
      ```
   1. `source-table-version`:
      ```bash
      aws dynamodb update-item \
        --region us-east-1 --table-name "efcms-deploy-${ENV}" \
        --key '{"pk":{"S":"source-table-version"}, "sk":{"S":"source-table-version"}}' \
        --update-expression "SET #current = :current" \
        --expression-attribute-names '{"#current":"current"}' \
        --expression-attribute-values '{":current":{"S":"alpha"}}'
      ```
1. Write feature flags to the deploy table:
   1. `aws-batch-zipper-minimum-count`:
      ```bash
      aws dynamodb update-item \
        --region us-east-1 --table-name "efcms-deploy-${ENV}" \
        --key '{"pk":{"S":"aws-batch-zipper-minimum-count"}, "sk":{"S":"aws-batch-zipper-minimum-count"}}' \
        --update-expression "SET #current = :current" \
        --expression-attribute-names '{"#current":"current"}' \
        --expression-attribute-values '{":current":{"N":"50"}}'
      ```
   1. `chief-judge-name`, replacing `<CHIEF JUDGE NAME>` with the current Chief Judge:
      ```bash
      aws dynamodb update-item \
        --region us-east-1 --table-name "efcms-deploy-${ENV}" \
        --key '{"pk":{"S":"chief-judge-name"}, "sk":{"S":"chief-judge-name"}}' \
        --update-expression "SET #current = :current" \
        --expression-attribute-names '{"#current":"current"}' \
        --expression-attribute-values '{":current":{"S":"<CHIEF JUDGE NAME>"}}'
      ```
   1. `clerk-of-court-configuration`, replacing `<CLERK OF COURT NAME>` with the current Clerk of the Court:
      ```bash
      aws dynamodb update-item \
        --region us-east-1 --table-name "efcms-deploy-${ENV}" \
        --key '{"pk":{"S":"clerk-of-court-configuration"}, "sk":{"S":"clerk-of-court-configuration"}}' \
        --update-expression "SET #current = :current" \
        --expression-attribute-names '{"#current":"current"}' \
        --expression-attribute-values '{":current":{"M":{"name":{"S":"<CLERK OF COURT NAME>"},"title": {"S":"Clerk of the Court"}}}}'
      ```
   1. `document-visibility-policy-change-date`:
      ```bash
      aws dynamodb update-item \
        --region us-east-1 --table-name "efcms-deploy-${ENV}" \
        --key '{"pk":{"S":"document-visibility-policy-change-date"}, "sk":{"S":"document-visibility-policy-change-date"}}' \
        --update-expression "SET #current = :current" \
        --expression-attribute-names '{"#current":"current"}' \
        --expression-attribute-values '{":current":{"S":"2023-08-01"}}'
      ```
   1. `e-consent-fields-enabled-feature-flag`:
      ```bash
      aws dynamodb update-item \
        --region us-east-1 --table-name "efcms-deploy-${ENV}" \
        --key '{"pk":{"S":"e-consent-fields-enabled-feature-flag"}, "sk":{"S":"e-consent-fields-enabled-feature-flag"}}' \
        --update-expression "SET #current = :current" \
        --expression-attribute-names '{"#current":"current"}' \
        --expression-attribute-values '{":current":{"BOOL":true}}'
      ```
   1. `entity-locking-feature-flag`:
      ```bash
      aws dynamodb update-item \
        --region us-east-1 --table-name "efcms-deploy-${ENV}" \
        --key '{"pk":{"S":"entity-locking-feature-flag"}, "sk":{"S":"entity-locking-feature-flag"}}' \
        --update-expression "SET #current = :current" \
        --expression-attribute-names '{"#current":"current"}' \
        --expression-attribute-values '{":current":{"BOOL":true}}'
      ```
   1. `maintenance-mode`:
      ```bash
      aws dynamodb update-item \
        --region us-east-1 --table-name "efcms-deploy-${ENV}" \
        --key '{"pk":{"S":"maintenance-mode"}, "sk":{"S":"maintenance-mode"}}' \
        --update-expression "SET #current = :current" \
        --expression-attribute-names '{"#current":"current"}' \
        --expression-attribute-values '{":current":{"BOOL":false}}'
      ```
   1. `section-outbox-number-of-days`:
      ```bash
      aws dynamodb update-item \
        --region us-east-1 --table-name "efcms-deploy-${ENV}" \
        --key '{"pk":{"S":"section-outbox-number-of-days"}, "sk":{"S":"section-outbox-number-of-days"}}' \
        --update-expression "SET #current = :current" \
        --expression-attribute-names '{"#current":"current"}' \
        --expression-attribute-values '{":current":{"N":"5"}}'
      ```
   1. `use-change-of-address-lambda`:
      ```bash
      aws dynamodb update-item \
        --region us-east-1 --table-name "efcms-deploy-${ENV}" \
        --key '{"pk":{"S":"use-change-of-address-lambda"}, "sk":{"S":"use-change-of-address-lambda"}}' \
        --update-expression "SET #current = :current" \
        --expression-attribute-names '{"#current":"current"}' \
        --expression-attribute-values '{":current":{"BOOL":true}}'
      ```
1. Create a configuration file for this environment:
   1. Copy the example configuration:
      ```bash
      cp scripts/env/environments/example.env "scripts/env/environments/ustc-${ENV}.env"
      ```
   1. Open the configuration file in your text editor of choice and replace the following variables with the appropriate values:
      1. `ENV`
      1. `AWS_PROFILE`
      1. `AWS_ACCOUNT_ID`
   1. Save the file
1. Become a `dawson_developer`:
   ```bash
   . scripts/env/set-env.zsh "ustc-${ENV}"
   ```
1. Merge `origin/staging` into the branch that corresponds to this lower environment:
   ```bash
   git checkout experimental9
   git pull
   git merge origin/staging
   git push
   ```
1. Deploy the latest docker image to this account's ECR:
   ```bash
   export DESTINATION_TAG=$(grep docker-image: .circleci/config.yml | awk -F':' '{print $3}')
   ./docker-to-ecr.sh
   ```
1. Create the `[env]_dawson` postgres user:
   ```bash
   cd ./scripts/postgres && ./create-rds-users.sh && cd../..
   ```
1. Trigger a deployment in the new environment, with the following settings:
   1. `run_build_and_deploy`: `false`
   1. `run_build_and_deploy_empty`: `true`
1. After the "empty" deployment completes, trigger another deployment, this time accepting the default settings
