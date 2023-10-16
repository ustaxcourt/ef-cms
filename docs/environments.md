# Environments

## Setup

### Initial environment setup

This document covers the initial setup needed to get EF-CMS continuous integration and deployment configured to a destination hosted in AWS.

### 1. Register for service accounts.

- [Amazon Web Services](https://portal.aws.amazon.com/gp/aws/developer/registration/) — hosting.
- [CircleCI](https://circleci.com/signup/) — test running and code deployment.

### 2. Configure your local developer machine.

- Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) and [configure it to use your admin AWS account credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).
  - This will be used to provision a limited-permission automated deployment account.

- Install [Terraform](https://learn.hashicorp.com/terraform/getting-started/install.html), which is used to automatically configure AWS.

  - See [Terraform tips & tricks](../terraform.md) for debugging and background information on Terraform.

- Clone this repository.

- Ensure that AWS Secrets Manager has a secret for the domain you’ll be hosting EF-CMS at. 
  - These can be found at [AWS Secrets Manager > Secrets](https://console.aws.amazon.com/secretsmanager/home?region=us-east-1#!/listSecrets/) for the Flexion environments.
    - Examples include exp1_deploy, 

### 3. Configure the AWS account for hosting EF-CMS.

- Create account-level AWS resources, including a IAM policy called `circle_ci_policy` which defines the permissions needed by our automated deployment scripts:
  - From the `iam/terraform/account-specific/main` folder, run `../bin/deploy-app.sh`:
    ```bash
    (cd iam/terraform/account-specific/main && ../bin/deploy-app.sh)
    ```

- Add an Access Key to the `CircleCI` user in [AWS Identity and Access Management](https://console.aws.amazon.com/iam/) which will be used by CircleCI to deploy code.
  - Note the AWS-generated access key and secret access key — it will needed shortly for the CircleCI setup.

- From the `iam/terraform/environment-specific/main` directory, use Terraform to create the Lambda roles & policies needed to run the backend:
  ```bash
  cd iam/terraform/environment-specific/main
  ../bin/deploy-app.sh dev
  ../bin/deploy-app.sh stg
  ../bin/deploy-app.sh test
  ../bin/deploy-app.sh prod
  ```

- Configure the Dynamsoft TWAIN library, which is used to enable scanning from EF-CMS:
  - Upload the library `.tar.gz` to a folder called Dynamsoft in the S3 bucket named `${EFCMS_DOMAIN}-software`. Note its ARN for CircleCI setup later.
  - Deploy Docker images to Amazon ECR with `./docker-to-ecr.sh`. This will build an image per the `Dockerfile` config, tag it as `latest`, and push it to the repo in ECR.
    - Both Flexion and USTC AWS accounts have container registries, so the image needs to be published to both registries.

### 4. Configure CircleCI to test and release code to this environment.

A prerequisite for a successful build within CircleCI is [access to CircleCI’s 2 X-large instances](https://circleci.com/pricing/#comparison-table). The memory footprint of the underlying services are too large for smaller instances — attempting a build with smaller instances will result in a cascading series of test failures, because Elasticsearch can’t operate within the memory constraints. At present, CircleCI requires contacting their sales staff to get access to 2 X-large instances.

- Configure CircleCI to [build this project](https://circleci.com/docs/2.0/getting-started/#setting-up-circleci).

- Setup [environment variables](https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project) in Project Settings:

  | Environment variable | Description |
  |----------------------|-------------|
  | `AWS_ACCOUNT_ID` | AWS account ID without hyphens |
  | `AWS_ACCESS_KEY_ID` | AWS access key for the AWS CircleCI user |
  | `AWS_SECRET_ACCESS_KEY` | AWS secret access key for the AWS CircleCI user |
  | `DYNAMSOFT_PRODUCT_KEYS`* | Dynamsoft Web TWAIN product key used |
  | `DYNAMSOFT_S3_ZIP_PATH`* | Dynamsoft Web TWAIN full S3 path ZIP configured above, e.g. `s3://bucketname/Dynamsoft/dynamic-web-twain-sdk-17.2.5.tar.gz` |
  | `EFCMS_DOMAIN`* | Domain name chosen above |
  | `COGNITO_SUFFIX`* | Suffix of your choice for the Cognito URL |
  | `USTC_ADMIN_USER` | Username of your choice used by the Cognito admin user |
  | `USTC_ADMIN_PASS` | Password of your choice used by the Cognito admin user |
  | `EMAIL_DMARC_POLICY`* | DMARC policy in the format of `v=DMARC1; p=none; rua=mailto:postmaster@example.com;` |
  | `IRS_SUPERUSER_EMAIL`* | Email address used to serve all new petitions to the IRS |
  | `DEFAULT_ACCOUNT_PASS` | Default password for all test accounts and some password resets |
  | `STATUSPAGE_DNS_RECORD` | DNS record for Statuspage of CNAME `status.${EFCMS_DOMAIN}` (optional) |
  | `SESSION_MODAL_TIMEOUT` | Time in ms to wait before logging the user out after the idle timeout modal displays (optional, default: `300000` / 5 mins) |
  | `SESSION_TIMEOUT` | Time in ms to wait displaying the idle timeout modal (optional, default: `3300000` / 55 mins) |
  | `CLIENT_STAGE` | The `process.env.STAGE` for the React application |
  | `BOUNCED_EMAIL_RECIPIENT`* | An email to which email bounced should be sent (defaults to noreply@`EFCMS_DOMAIN`) |
  | `PROD_ENV_ACCOUNT_ID` | The account ID of the AWS account with Production Data |
  | `LOWER_ENV_ACCOUNT_ID` | The account ID of the AWS account where copies of Production Data might live |
  | `SLACK_WEBHOOK_URL` | Optional URL to send POST requests to notify a Slack App |
  | `BOUNCE_ALERT_RECIPIENTS` | Optional comma separated list of Email addresses to be notified when email bounces to the `IRS_SUPERUSER_EMAIL` |

  > **Note:**\
  `*` - These environment variables are now stored in AWS Secrets Manager and retrieved as part of the deployment 

- Run a build in CircleCI.
  - The build may fail the first time, as provisioning new security certificates can take some time (and cause a timeout). See [the troubleshooting guide](/additional-resources/troubleshooting) for solutions to common problems.

### Setting up a new environment

EF-CMS currently has both the concept of a deployment at a domain as well as a named environment (stg, mig, prod, test). This section refers to the latter.

1. Choose a name for the branch which will be used for deployments (henceforth `$BRANCH`). Examples are 'prod', 'develop', 'staging'.

2. Choose a name for this environment (henceforth `$ENVIRONMENT`). Examples are 'prod', 'dev', 'stg'.

3. Add CircleCI badge link to the README.md according to `$BRANCH`.

4. Create a new .sh in the `./env-for-circle` directory and follow the other file structures.

5. Add mention of your environment, if appropriate, to `setup.md`.

6. Modify `.circleci/config.yml` to add `$ENVIRONMENT` to every step under `build-and-deploy` where you want it to be built and deployed.

7. Update CircleCI to have all the new environment variables needed.

8. Setup account specific infrastructure if it has not already been run for the account.
    ```bash
    npm run deploy:account-specific
    ```

9. Setup environment specific infrastructure.
    ```bash
    npm run deploy:environment-specific <ENVIRONMENT>
    ```

10. Attempt to run a deploy on circle. The deploy will fail on the deploy web-api step. In order to resolve the error, run:
    ```bash
    ./setup-s3-deploy-files.sh <ENVIRONMENT>
    ```
    ```bash
    ./setup-s3-maintenance-file.sh <ENVIRONMENT>
    ```
    ```bash
    ./web-api/verify-ses-email.sh
    ```

11. Setup the environment's migrate flag:
    ```bash
    aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENVIRONMENT}" --item '{"pk":{"S":"migrate"},"sk":{"S":"migrate"},"current":{"BOOL":true}}'
    ```

12. Setup the environment's current color:
    ```bash
    aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENVIRONMENT}" --item '{"pk":{"S":"current-color"},"sk":{"S":"current-color"},"current":{"S":"blue"}}'
    ```

13. Setup all database configuration flags:
    ```bash
    ./scripts/setup-all-env-configuration.sh <ENVIRONMENT>
    ```
14. Setup the environment's source table version:
    ```bash
    aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENVIRONMENT}" --item '{"pk":{"S":"source-table-version"},"sk":{"S":"source-table-version"},"current":{"S":"alpha"}}'
    ```

15. Setup the environment's destination table version:
    ```bash
    aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENVIRONMENT}" --item '{"pk":{"S":"destination-table-version"},"sk":{"S":"destination-table-version"},"current":{"S":"beta"}}'
    ```

16. Set the environment's maintenance-mode flag to **false**:
    ```bash
    aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENVIRONMENT}" --item '{"pk":{"S":"maintenance-mode"},"sk":{"S":"maintenance-mode"},"current":{"BOOL": false}}'
    ```

17. Delete the destination DynamoDB tables from us-east-1 and us-west-1. 

18. Delete the destination ElasticSearch cluster from us-east-1.

19. Rerun the circle deploy from step 10.

20. If the environment is a test environment, setup test users and judges so smoketests will pass:
    ```bash
    ts-node --transpile-only shared/admin-tools/user/setup-admin.ts
    ```
    ```bash
    . ./shared/admin-tools/user/setup-test-users.sh "${ENV}"
    ```
    ```bash
    ENV=exp5 FILE_NAME=./scripts/circleci/judge/judge_users.csv ./scripts/circleci/judge/bulk-import-judge-users.sh
    ```

See [the troubleshooting guide](/additional-resources/troubleshooting) for solutions to problems that may arise during this deploy process.

## Releases

### Continuous release process with CircleCI

Once CircleCI is configured, any merge to an environment’s branch will automatically kick off a deployment to that environment.

**There is a manual release step**, however, documented below.

### Manual deployment steps

When CircleCI runs due to code being merged, automated tests run first, and if they are successful, automated deploy begins. **This presents a race condition.**

Before the automated deploy phase happens, any account-specific or environment-specific changes to the AWS IAM permissions for the CI deployer and roles needed for deploying lambdas needs to happen, or else the build may fail.

These commands are run manually as an administrator, since they provision AWS account-level resources which the automated deployment user does not have permission to change.

- **For the first deploy that happens in an AWS account, and for any subsequent changes to these resources,** the account-specific Terraform command needs to be run manually, from the branch being deployed:

  ```bash
  (cd iam/terraform/account-specific/main && ../bin/deploy-app.sh)
  ```

- **For the first deploy that happens in an environment (stg, prod, test), and for any subsequent changes to these resources,** the environment-specific Terraform command needs to be run manually, from the branch being deployed, with the name of the environment for that branch:

  ```bash
  # This command is for the stg environment specifically:
  (cd iam/terraform/environment-specific/main && ../bin/deploy-app.sh stg)
  ```

- See [Terraform tips & tricks](../terraform.md) for debugging and background information on Terraform.

### What to do if you aren’t fast enough

As mentioned above, this is a race condition. In order to run these commands, the code must be merged, which kicks off the automated tests and deployment. However, these commands must be run before the automated deployment starts.

If the build fails due to lambdas being unable to assume IAM roles, or the deployer encounters a permission denied error, these manual steps may not have completed in time. Re-run the CircleCI build from failed once the manual deployment steps are complete.

If the build fails for other reasons, be sure to check the [troubleshooting document](/additional-resources/troubleshooting).


## Teardown

Sometimes you'll find the need to remove an environment to start from a fresh state.  To remove an environment, configure your local machine the same as you would during the [setup](/environments?id=setup) section.

```bash
npm run destroy:env <ENV>
npm run destroy:client <ENV>
npm run destroy:api <ENV>
npm run destroy:migration <ENV>
npm run destroy:migration-cron <ENV>
```

See [the troubleshooting guide](/additional-resources/troubleshooting) for solutions to problems that may arise during the teardown process.
