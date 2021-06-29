# Initial environment setup

This document covers the initial setup needed to get EF-CMS continuous integration and deployment configured to a destination hosted in AWS.

## 1. Register for service accounts.

- [Amazon Web Services](https://portal.aws.amazon.com/gp/aws/developer/registration/) — hosting.
- [CircleCI](https://circleci.com/signup/) — test running and code deployment.

## 2. Configure your local developer machine.

- Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) and [configure it to use your admin AWS account credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).
  - This will be used to provision a limited-permission automated deployment account.

- Install [Terraform](https://learn.hashicorp.com/terraform/getting-started/install.html), which is used to automatically configure AWS.

  - See [Terraform tips & tricks](../terraform.md) for debugging and background information on Terraform.

- Clone this repository.

- Set the `EFCMS_DOMAIN` environment variable to the domain you’ll be hosting EF-CMS at. You may want to set this in your `~/.zshrc` file for ease of use:
  ```bash
  export EFCMS_DOMAIN="example.com"
  ```

## 3. Configure the AWS account for hosting EF-CMS.

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
  - Deploy Docker images to Amazon ECR with `./docker-to-ecr.sh`. This will build an image per the `Dockerfile-CI` config, tag it as `latest`, and push it to the repo in ECR.

## 4. Configure CircleCI to test and release code to this environment.

A prerequisite for a successful build within CircleCI is [access to CircleCI’s 2 X-large instances](https://circleci.com/pricing/#comparison-table). The memory footprint of the underlying services are too large for smaller instances — attempting a build with smaller instances will result in a cascading series of test failures, because Elasticsearch can’t operate within the memory constraints. At present, CircleCI requires contacting their sales staff to get access to 2 X-large instances.

- Configure CircleCI to [build this project](https://circleci.com/docs/2.0/getting-started/#setting-up-circleci).

- Setup [environment variables](https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project) in Project Settings:

  | Environment variable | Description |
  |----------------------|-------------|
  | `AWS_ACCOUNT_ID` | AWS account ID without hyphens |
  | `AWS_ACCESS_KEY_ID` | AWS access key for the AWS CircleCI user |
  | `AWS_SECRET_ACCESS_KEY` | AWS secret access key for the AWS CircleCI user |
  | `SONAR_ORG` | SonarCloud organization name |
  | `SHARED_SONAR_KEY` | SonarCloud key for the shared project |
  | `SHARED_SONAR_TOKEN` | SonarCloud token for the shared project |
  | `API_SONAR_KEY` | SonarCloud key for the API project |
  | `API_SONAR_TOKEN` | SonarCloud token for the API project |
  | `UI_SONAR_KEY` | SonarCloud key for the UI project |
  | `UI_SONAR_TOKEN` | SonarCloud token for the UI project |
  | `DYNAMSOFT_PRODUCT_KEYS_STG` | Dynamsoft Web TWAIN product key used for STG |
  | `DYNAMSOFT_PRODUCT_KEYS_TEST` | Dynamsoft Web TWAIN product key used for TEST |
  | `DYNAMSOFT_PRODUCT_KEYS_PROD` | Dynamsoft Web TWAIN product key used for PROD |
  | `DYNAMSOFT_S3_ZIP_PATH` | Dynamsoft Web TWAIN full S3 path ZIP configured above, e.g. `s3://bucketname/Dynamsoft/dynamic-web-twain-sdk-14.3.1.tar.gz` |
  | `EFCMS_DOMAIN` | Domain name chosen above |
  | `COGNITO_SUFFIX` | Suffix of your choice for the Cognito URL |
  | `USTC_ADMIN_USER` | Username of your choice used by the Cognito admin user |
  | `USTC_ADMIN_PASS` | Password of your choice used by the Cognito admin user |
  | `EMAIL_DMARC_POLICY` | DMARC policy in the format of `v=DMARC1; p=none; rua=mailto:postmaster@example.com;` |
  | `IRS_SUPERUSER_EMAIL_STG` | Email address used to serve all new petitions to the IRS for STG |
  | `IRS_SUPERUSER_EMAIL_TEST` | Email address used to serve all new petitions to the IRS for TEST |
  | `IRS_SUPERUSER_EMAIL_PROD` | Email address used to serve all new petitions to the IRS for PROD |
  | `DEFAULT_ACCOUNT_PASS` | Default password for all test accounts and some password resets |
  | `STATUSPAGE_DNS_RECORD` | DNS record for Statuspage of CNAME `status.${EFCMS_DOMAIN}` (optional) |
  | `SESSION_MODAL_TIMEOUT` | Time in ms to wait before logging the user out after the idle timeout modal displays (optional, default: `300000` / 5 mins) |
  | `SESSION_TIMEOUT` | Time in ms to wait displaying the idle timeout modal (optional, default: `3300000` / 55 mins) |
  | `CLIENT_STAGE` | The `process.env.STAGE` for the React application |
  | `BOUNCED_EMAIL_RECIPIENT` | An email to which email bounced should be sent (defaults to noreply@`EFCMS_DOMAIN`) |

- Run a build in CircleCI.
  - The build may fail the first time, as provisioning new security certificates can take some time (and cause a timeout). See [the troubleshooting guide](../TROUBLESHOOTING.md) for solutions to common problems.

## Setting up a new environment

EF-CMS currently has both the concept of a deployment at a domain as well as a named environment (stg, mig, prod, test). This section refers to the latter.

1. Choose a name for the branch which will be used for deployments (henceforth `$BRANCH`). Examples are 'prod', 'develop', 'staging'.
2. Choose a name for this environment (henceforth `$ENVIRONMENT`). Examples are 'prod', 'dev', 'stg'.
3. Add CircleCI badge link to the README.md according to `$BRANCH`
4. Edit `get-es-instance-count.sh`, adding a new `elif` statement for your `$BRANCH` which returns the appropriate number of ElasticSearch instances.
5. Edit `get-keys.sh`, adding a new `elif` statement for your `$BRANCH` which echoes the `$ENVIRONMENT`-specific Dynamsoft licensing keys; licensing requires that each environment use their own unique keys.
6. Edit `get-env.sh`, adding a new `elif` statement for your `$BRANCH` which echoes the environment name.
7. Add mention of your environment, if appropriate, to `SETUP.md`
    - to create Lambda roles & policies:
      - e.g. `cd iam/terraform/environment-specific/main && ../bin/deploy-app.sh $ENVIRONMENT`
    - mention your `DYNAMSOFT_PRODUCT_KEYS_$ENVIRONMENT`
8. Run the `deploy-app.sh` command that you just added to `SETUP.md`.
9. Modify `.circleci/config.yml` to add `$ENVIRONMENT` to every step under `build-and-deploy` where you want it to be built and deployed.
10. Update CircleCI to have all the new environment variables needed.
11. Setting up Users

    1. The new environment will require an Admin account for creating users. Run the following command to create the admin account. NOTE: this script also deactivates this user.

        ```bash
        node shared/admin-tools/user/setup-admin.js
        ```

    2. If the new environment is a test environment, we have a script to setup test users for the various roles throughout the application. It activates and then deactivates the Admin user.

        ```bash
        node shared/admin-tools/user/setup-test-users.js
        ```

Then, follow the instructions found in the [Blue-Green Migration documentation](../BLUE_GREEN_MIGRATION.md) for a first-time deployment.

A deploy of a new environment is likely to require _two_ attempts to work, due to Terraform limitations. See [the troubleshooting guide](TROUBLESHOOTING.md) for solutions to problems that may arise during this deploy process.
