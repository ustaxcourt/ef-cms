# Creating a New Lower Environment in an Empty AWS Account

## Description

This runbook describes the process of creating a new DAWSON lower environment in an otherwise empty AWS account.

## ⚠️ Caution ⚠️

Proceed with the expectation that this runbook is out of date. Carefully inspect every command and script herein, cross-referencing operational environments, before running. Assume all AWS console and CircleCI navigation directions are out of date. Update this document as necessary.

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
1. Set up the OpenSearch mappings for CloudWatch logs in Kibana:
   1. Create a user in the `log_viewers` user pool:
      1. Determine the user pool id:
         ```bash
         export LOG_VIEWER_POOL_ID=$(aws cognito-idp list-user-pools \
           --query "UserPools[?Name == 'log_viewers'].Id | [0]" \
           --max-results 1 --region us-east-1 --output text)
         ```
      1. Create a user, replacing `<USERNAME>` with your chosen username and `<COURT EMAIL ADDRESS>` with your Court email address:
         ```bash
         aws cognito-idp admin-create-user \
           --user-pool-id "$LOG_VIEWER_POOL_ID" \
           --username "<USERNAME>" \
           --region us-east-1 \
           --user-attributes 'Name="email",Value="<COURT EMAIL ADDRESS>"' \
           --temporary-password "Testing1234$"
         ```
   1. Log into Kibana (renamed OpenSearch Dashboards) with the new user:
      1. Determine the Kibana URL and launch it in your default browser:
         ```bash
         export LOG_CLUSTER_DOMAIN=$(aws opensearch describe-domain \
           --domain-name info \
           --query "DomainStatus.Endpoint" \
           --output text)
         open "https://${LOG_CLUSTER_DOMAIN}/_dashboards"
         ```
      1. Log in with the user you just created, using the temporary password
      1. Set a new permanent password and save your credentials
   1. Create a mapping template for indices beginning with `cwl`:
      1. In Kibana, navigate to the "Dev Tools" (near the bottom of the main menu)
      1. Replace the query on the left with the following:
         ```
         PUT _template/cwl
         ```
      1. In your terminal, copy the contents of `./aws/lambdas/LogsToElasticSearch_info/index-template.json` to your clipboard:
         ```bash
         pbcopy < ./aws/lambdas/LogsToElasticSearch_info/index-template.json
         ```
      1. Back in the browser, paste the contents you just copied, starting on a newline under `PUT _template/cwl`
      1. Click the play button to submit the query
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
   unset AWS_PROFILE AWS_ROLE_ARN AWS_SESSION_EXPIRATION AWS_SESSION_INFO AWS_SESSION_TOKEN
   export AWS_ACCESS_KEY_ID=<CIRCLECI AWS_ACCESS_KEY_ID>
   export AWS_SECRET_ACCESS_KEY=<CIRCLECI AWS_SECRET_ACCESS_KEY>
   ```
1. Run an `allColors` terraform deployment, resolving errors when necessary:
   1. Set up some environment variables emulating a blue -> green deployment:
      ```bash
      export CURRENT_COLOR=blue
      export DEPLOYING_COLOR=green
      export SOURCE_TABLE="efcms-${ENV}-alpha"
      export DESTINATION_TABLE="efcms-${ENV}-alpha"
      ```
   1. Run an `allColors` terraform deployment:
      ```bash
      npm run deploy:allColors "$ENV"
      ```
   1. The ACM (SSL) certificates will fail to validate. To resolve, you will need to copy the `NS` record for this hosted zone into all of the hosted zones that precede it:
      1. Log into this new account in the AWS console and navigate to the Route 53 dashboard
      1. Click on "Hosted zones" and select this environment's hosted zone
      1. Click on the "Type" filter and select "NS"
      1. Copy the value of this hosted zone's `NS` record to your clipboard
      1. Log into the AWS console for the account that owns the `ustaxcourt.gov` hosted zone and navigate to the Route 53 dashboard
      1. Click on "Hosted zones" and select the `ustaxcourt.gov` hosted zone
      1. Create a new `NS` record:
         1. Click "Create record"
         1. Record name: `<env>.ef-cms`
         1. Record type: `NS`
         1. Paste the value you copied earlier
         1. Click "Create record" to create the `NS` record
      1. Log into the AWS console for the account that owns the `ef-cms.ustaxcourt.gov` hosted zone and navigate to the Route 53 dashboard
      1. Click on "Hosted zones" and select the `ef-cms.ustaxcourt.gov` hosted zone
      1. Create a new `NS` record:
         1. Click "Create record"
         1. Record name: `<env>`
         1. Record type: `NS`
         1. Paste the value you copied earlier
         1. Click "Create record" to create the `NS` record
   1. The Cognito pool will fail to create. To resolve, run a script to verify the `noreply@<env>.ef-cms.ustaxcourt.gov` email address:
      ```bash
      EFCMS_DOMAIN="${ENV}.ef-cms.ustaxcourt.gov" REGION=us-east-1 web-api/verify-ses-email.sh
      ```
   1. The SES `email_forwarding_rule_set` is not active. To activate:
      1. Log in to this new account in the AWS console and navigate to the SES dashboard
      1. Click on "Email receiving"
      1. Click the checkbox next to the `email_forwarding_rule_set` and click "Set as active"
   1. Run an `allColors` terraform deployment again now that the errors have been resolved:
      ```bash
      npm run deploy:allColors "$ENV"
      ```
1. Run a color-specific terraform deployment for green:
   1. Run a color-specific terraform deployment:
      ```bash
      npm run "deploy:${DEPLOYING_COLOR}" "$ENV"
      ```
   1. The first run will fail, but you can run it again without modifying anything and it will succeed the second time:
      ```bash
      npm run "deploy:${DEPLOYING_COLOR}" "$ENV"
      ```
1. Run a color-specific terraform deployment for blue:
   1. Set up some environment variables emulating a green -> blue deployment:
      ```bash
      export CURRENT_COLOR=green
      export DEPLOYING_COLOR=blue
      ```
   1. Run a color-specific terraform deployment:
      ```bash
      npm run "deploy:${DEPLOYING_COLOR}" "$ENV"
      ```
   1. The first run will fail, but you can run it again without modifying anything and it will succeed the second time:
      ```bash
      npm run "deploy:${DEPLOYING_COLOR}" "$ENV"
      ```
1. Write configuration values to the deploy table:
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
   cd ./scripts/postgres && ./create-rds-users.sh && cd ../..
   ```
1. In [CircleCI](https://app.circleci.com/pipelines/github/ustaxcourt/ef-cms), trigger a deployment in the new environment, with the following settings:
   1. `run_build_and_deploy`: `false`
   1. `run_build_and_deploy_empty`: `true`
1. After the "empty" deployment completes, trigger another deployment, this time accepting the default settings. Note: outgoing email will fail until the account is promoted out of the SES sandbox.
