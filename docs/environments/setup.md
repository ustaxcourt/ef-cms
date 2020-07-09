# Initial environment setup

This document covers the initial setup needed to get EF-CMS continuous integration and deployment configured to a destination hosted in AWS.

## 1. Register for service accounts.

- [Amazon Web Services](https://portal.aws.amazon.com/gp/aws/developer/registration/) — hosting.
- [CircleCI](https://circleci.com/signup/) — test running and code deployment.
- [SonarCloud](https://sonarcloud.io/) — static code analysis.
  - Create a [organization](https://sonarcloud.io/create-organization). Make note of the name chosen for CircleCI configuration later.
  - There are three sub-projects to the EF-CMS — the front-end (the UI), the back-end (the API), and shared code. Make note of each project’s key and token for CircleCI configuration later.
- [Honeybadger](https://www.honeybadger.io/plans/) — exception monitoring.
  - Make note of the key for CircleCI configuration later.

## 2. Configure your local developer machine.

- Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) and [configure it to use your admin AWS account credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).
  - This will be used to provision a limited-permission automated deployment account.

- Install [Terraform](https://learn.hashicorp.com/terraform/getting-started/install.html), which is used to automatically configure AWS.

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

- Create a `CircleCI` user in [AWS Identity and Access Management](https://console.aws.amazon.com/iam/) which will be used by CircleCI to deploy code.
  - In IAM, attach the `circle_ci_policy` created by Terraform to your `CircleCI` user.
  - Note the AWS-generated access key and secret access key — it will needed shortly for the CircleCI setup.

- Create a [Route53 Hosted Zone](https://console.aws.amazon.com/route53/home) which matches the configured `EFCMS_DOMAIN` decided above, making sure it is a `Public Hosted Zone` so it’s accessible over the internet. Make sure the domain name ends with a period.

- From the `iam/terraform/environment-specific/main` directory, use Terraform to create the Lambda roles & policies needed to run the backend:
  ```bash
  cd iam/terraform/environment-specific/main
  ../bin/deploy-app.sh dev
  ../bin/deploy-app.sh stg
  ../bin/deploy-app.sh test
  ../bin/deploy-app.sh prod
  ```
  - Make a note of the ARNs that are output, to use shortly for the CircleCI setup.

- Configure the Dynamsoft TWAIN library, which is used to enable scanning from EF-CMS:

  - Create a private S3 bucket and put the Dynamsoft Dynamic Web TWAIN ZIP file inside that bucket.
  - Setup a role & policy for accessing the Dynamsoft ZIP file that is hosted on a private S3 bucket:
    - The role name must match `dynamsoft_s3_download_role`, and it must be for `EC2`.
    - The policy must have `s3:GetObject` access to your bucket.
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
  | `CIRCLE_HONEYBADGER_API_KEY_STG` | Honeybadger key used for STG |
  | `CIRCLE_HONEYBADGER_API_KEY_TEST` | Honeybadger key used for TEST |
  | `CIRCLE_HONEYBADGER_API_KEY_PROD` | Honeybadger key used for PROD |
  | `EFCMS_DOMAIN` | Domain name chosen above |
  | `COGNITO_SUFFIX` | Suffix of your choice for the Cognito URL |
  | `USTC_ADMIN_PASS` | Password of your choice used by the Cognito admin user |
  | `SES_DMARC_EMAIL` | Email address used with SES to which aggregate DMARC validations are sent |
  | `IRS_SUPERUSER_EMAIL` | Email address used to serve all new petitions to the IRS |

- Run a build in CircleCI.
  - The build may fail the first time, as provisioning new security certificates can take some time (and cause a timeout). See [the troubleshooting guide](../TROUBLESHOOTING.md) for solutions to common problems.

## Setting up a new environment

EF-CMS currently has both the concept of a deployment at a domain as well as a named environment (stg, mig, prod, test). This section refers to the latter.

1. Choose a name for the branch which will be used for deployments (henceforth `$BRANCH`). Examples are 'master', 'develop', 'staging'.
2. Choose a name for this environment (henceforth `$ENVIRONMENT`). Examples are 'prod', 'dev', 'stg'.
3. Add CircleCI badge link to the README.md according to `$BRANCH`
4. Edit `get-es-instance-count.sh`, adding a new `elif` statement for your `$BRANCH` which returns the appropriate number of ElasticSearch instances.
5. Edit `get-keys.sh`, adding a new `elif` statement for your `$BRANCH` which echoes the `$ENVIRONMENT`-specific Dynamsoft licensing keys; licensing requires that each environment use their own unique keys.
6. Edit `get-env.sh`, adding a new `elif` statement for your `$BRANCH` which echoes the environment name.
8. Create the `config/$ENVIRONMENT.yml` (e.g. `config/stg.yml`)
9. Create the `web-api/config/$ENVIRONMENT.yml` (e.g. `web-api/config/stg.yml`)
10. Add mention of your environment, if appropriate, to `SETUP.md`
    - to create Lambda roles & policies:
      - e.g. `cd iam/terraform/environment-specific/main && ../bin/deploy-app.sh $ENVIRONMENT`
    - mention your `DYNAMSOFT_PRODUCT_KEYS_$ENVIRONMENT`
11. Run the `deploy-app.sh` command that you just added to `SETUP.md`.
13. For all files matching `web-api/serverless-*yml`, include your `$ENVIRONMENT` within the list of `custom.alerts.stages` if you want your `$ENVIRONMENT` to be included in those which are monitored & emails delivered upon alarm.
14. Modify `.circleci/config.yml` to add `$ENVIRONMENT` to every step under `build-and-deploy` where you want it to be built and deployed.
15. Update CircleCI to have all the new environment variables needed:
     - DYNAMSOFT_PRODUCT_KEYS_`$ENVIRONMENT`

A deploy of a new environment is likely to require _two_ attempts to work, due to Terraform limitations. See [the troubleshooting guide](TROUBLESHOOTING.md) for solutions to problems that may arise during this deploy process.
