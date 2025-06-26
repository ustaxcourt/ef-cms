# Creating a New Lower Environment in an Empty AWS Account

## Description

This runbook describes the process of creating a new DAWSON lower environment in an otherwise empty AWS account.

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
    - Number of days to keep logs in Kibana
    - Number of nodes in the Opensearch cluster for Kibana
    - 

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
        --log-expiration-days 90 \
        --opensearch-logs-instance-count 2 \
        --opensearch-logs-instance-type "m5.large.search" \
        --opensearch-logs-volume-size 200
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
        --opensearch-instance-count 3 \
        --opensearch-instance-type "r7g.large.search" \
        --opensearch-volume-size 350 \
        --prod-account-id "<PROD ACCOUNT ID>" \
        --prod-documents-bucket "<PROD DOCUMENTS BUCKET NAME>" \
        --rds-max-capacity 32 \
        --rds-min-capacity 1 \
        --rum-sample-rate 1
      ```
1. Create Cloudwatch log groups:
   ```bash
   scripts/cloudwatch/create-missing-log-groups.sh "$ENV"
   ```
1. Run an `account-specific` terraform deployment:
   ```bash
   npm run deploy:account-specific
   ```
1. Set up a CircleCI context:
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
      1. Add an `AWS_SECRET_ACCESS_KEY_ID` environment variable:
         1. Click "Add environment variable"
            1. Environment variable name: `AWS_SECRET_ACCESS_KEY_ID`
            1. Value: Enter the value from the output you copied earlier
            1. Click "Add environment variable"
1. Merge `origin/staging` to the branch that corresponds to this lower environment:
   ```bash
   git checkout experimental9
   git pull
   git merge origin/staging
   git push
   ```
1. Trigger a deployment in the new environment, accepting the default settings
