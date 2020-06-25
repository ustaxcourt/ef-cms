# Setup for CircleCI CI/CD Pipeline

## Prerequisites
- [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/).
- [Install the AWS CLI on your local system](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) and [configure it to use your IAM credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).
- [Install Terraform](https://learn.hashicorp.com/terraform/getting-started/install.html) version 0.11 on your local system. (Version 0.12 will not work.)
- Create a `CircleCI` user in [AWS Identity and Access Management](https://console.aws.amazon.com/iam/):
     - Create the IAM policy for Circle CI via the project Terraform scripts:
          - Make the intended domain name available on your local system, e.g. `export EFCMS_DOMAIN="ef-cms.example.gov"`
          - Create the policies on your local system: `cd iam/terraform/account-specific/main && ../bin/deploy-app.sh`
     - In IAM, attach the `circle_ci_policy` to your `CircleCI` user.
     - Note the AWS-generated access key and secret access key — it will needed shortly for the CircleCI setup.
- [Create a Route53 Hosted Zone](https://console.aws.amazon.com/route53/home) This will be used for setting up the domains for the UI and API.  Create the desired domain name (e.g. `ef-cms.example.gov.`) and make sure it is a `Public Hosted Zone`. This is the value you will set for `EFCMS_DOMAIN` in CircleCI.  Make sure the domain name ends with a period.
- Create the Lambda roles & policies needed for the Lambdas that run the backend:
     - `cd iam/terraform/environment-specific/main && ../bin/deploy-app.sh dev`
     - `cd iam/terraform/environment-specific/main && ../bin/deploy-app.sh stg`
     - `cd iam/terraform/environment-specific/main && ../bin/deploy-app.sh test`
     - `cd iam/terraform/environment-specific/main && ../bin/deploy-app.sh prod`
          - Make a note of the ARNs that are output, to use shortly for the CircleCI setup.
- [Create a SonarCloud account](https://sonarcloud.io/). SonarCloud will be used to tests each build.
- [Create a new SonarCloud organization](https://sonarcloud.io/create-organization).
  - There are three sub-projects to the EF-CMS — the front-end (the UI), the back-end (the API), and shared code. Each is handled separately by CircleCI and SonarCloud.
  - [Create a project and project key](https://sonarcloud.io/projects/create?manual=true) for the UI. (This will be referred to as `UI_SONAR_TOKEN` when setting up CircleCI.)
  - [Create a project and project key](https://sonarcloud.io/projects/create?manual=true) for the API. (This will be referred to as `API_SONAR_TOKEN` when setting up CircleCI.)
  - [Create a project and project key](https://sonarcloud.io/projects/create?manual=true) for the shared code. (This will be referred to as `SHARED_SONAR_TOKEN` when setting up CircleCI.)
  - [Create a GitHub Access Token](https://github.com/settings/tokens) click "Generate new token" and keep track of the generated token.  This will be used later in the CircleCI setup.
  - On AWS, create a private S3 bucket and put the Dynamsoft Dynamic Web TWAIN ZIP file inside that bucket
  - On AWS, setup a role & policy for accessing the Dynamsoft ZIP file that is hosted on a private S3 bucket
     - The role name must match `dynamsoft_s3_download_role`, and it must be for `EC2`
     - The policy must have `s3:GetObject` access to your bucket
- Deploy Docker images to Amazon ECR with `./docker-to-ecr.sh`. This will build an image per the `Dockerfile-CI` config, tag it as `latest`, and push it to the repo in ECR.

## CircleCI Setup
A prerequisite for a successful build within CircleCI is [access to CircleCI’s 2 X-large instances](https://circleci.com/pricing/#comparison-table). The memory footprint of the underlying services are too large for smaller instances — attempting a build with smaller instances will result in a cascading series of test failures, because Elasticsearch can’t operate within the memory constraints. At present, CircleCI requires contacting their sales staff to get access to 2 X-large instances.

1. Set up a [CircleCI](https://circleci.com/) account
2. Click "Add Projects"
3. Click "Set Up Project" next to the Court's repo
4. Click "Start Building" with defaults
5. Go to the settings of the project in CircleCI via clicking on the project / job, and clicking the gear icon
6. Click "Environment Variables"
7. Add the following:
     - `AWS_ACCOUNT_ID` (the AWS account ID, without hyphens, e.g. `345678901234`)
     - `AWS_ACCESS_KEY_ID` (the access key for the AWS CircleCI user created in the Prerequisites)
     - `AWS_SECRET_ACCESS_KEY` (the secret access key for the AWS CircleCI user created in the Prerequisites)
     - `EFCMS_DOMAIN` (the domain indented for use by the court, e.g., `ef-cms.example.gov`)
     - `SONAR_ORG` (your SonarCloud organization’s name)
     - `SHARED_SONAR_KEY` (the SonarCloud key for the shared project)
     - `SHARED_SONAR_TOKEN` (the token for the SonarCloud shared project)
     - `API_SONAR_KEY` (the SonarCloud key for the API project)
     - `API_SONAR_TOKEN` (the token for the SonarCloud API project)
     - `UI_SONAR_KEY` (the SonarCloud key for the UI project)
     - `UI_SONAR_TOKEN` (the token for the SonarCloud UI project)
     - `COGNITO_SUFFIX` (a suffix of your choice for the Cognito URL)
     - `USTC_ADMIN_PASS` (a unique password of your choice used by the Cognito admin user)
     - `DYNAMSOFT_PRODUCT_KEYS_DEV` (the product key provided after purchasing Dynamic Web TWAIN)
     - `DYNAMSOFT_PRODUCT_KEYS_STG`  (the product key provided after purchasing Dynamic Web TWAIN)
     - `DYNAMSOFT_PRODUCT_KEYS_TEST`  (the product key provided after purchasing Dynamic Web TWAIN)
     - `DYNAMSOFT_PRODUCT_KEYS_PROD`  (the product key provided after purchasing Dynamic Web TWAIN)
     - `DYNAMSOFT_S3_ZIP_PATH` (the full S3 path to the Dynamic Web TWAIN ZIP, e.g. `s3://ef-cms.ustaxcourt.gov-software/Dynamsoft/dynamic-web-twain-sdk-14.3.1.tar.gz`)
     - `SES_DMARC_EMAIL` (email address used with SES to which aggregate DMARC validations are sent)
     - `IRS_SUPERUSER_EMAIL` (email address used to serve all new petitions to the IRS)
8. Run a build in CircleCI.

## Setting up a new environment
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
