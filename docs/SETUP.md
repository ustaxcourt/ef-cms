# Setup for CircleCI CI/CD Pipeline

## Prerequisites
- [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/).
- [Install the AWS CLI on your local system](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) and [configure it to use your IAM credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).
- [Install Terraform](https://learn.hashicorp.com/terraform/getting-started/install.html) on your local system.
- (e.g. `ef-cms.example.gov.`).
- Create a `CircleCI` user in [AWS Identity and Access Management](https://console.aws.amazon.com/iam/):
     - Create the `circle_ci_policy` via the project Terraform scripts:
          - Make the intended domain name available on your local system, e.g. `export EFCMS_DOMAIN="ef-cms.example.gov"`
          - Create the policies on your local system: `cd iam/terraform/account-specific/main && ../bin/deploy-app.sh`
     - Attach this policy to your `CircleCI` user.
     - Note the AWS-generated access key and secret access key — it will needed shortly for the CircleCI setup.
- [Create a Route53 Hosted Zone](https://console.aws.amazon.com/route53/home) This will be used for setting up the domains for the UI and API.  Create the desired domain name (e.g. `ef-cms.example.gov.`) and make sure it is a `Public Hosted Zone`. This is the value you will set for `EFCMS_DOMAIN` in CircleCI.  Make sure the domain name ends with a period.
- Create the lambda roles & policies needed for the lambdas that run the backend:
     - `cd iam/environment-specific/terraform/main && ../bin/deploy-app dev`
     - `cd iam/environment-specific/terraform/main && ../bin/deploy-app stg`
     - `cd iam/environment-specific/terraform/main && ../bin/deploy-app prod`
- [Create a SonarCloud account](https://sonarcloud.io/). SonarCloud will be used to tests each build.
- [Create a new SonarCloud organization](https://sonarcloud.io/create-organization).
  - There are three sub-projects to the EF-CMS — the front-end (the UI), the back-end (the API), and shared code. Each is handled separately by Jenkins and SonarCloud.
  - [Create a project and project key](https://sonarcloud.io/projects/create?manual=true) for the UI. (This will be referred to as `UI_SONAR_TOKEN` when setting up Jenkins.)
  - [Create a project and project key](https://sonarcloud.io/projects/create?manual=true) for the API. (This will be referred to as `API_SONAR_TOKEN` when setting up Jenkins.)
  - [Create a project and project key](https://sonarcloud.io/projects/create?manual=true) for the SHARED code. (This will be referred to as `SHARED_SONAR_TOKEN` when setting up Jenkins.)
  - [Create a Github Access Token](https://github.com/settings/tokens) click "Generate new token" and keep track of the generated token.  This will be used later in the CircleCI setup.
  - On AWS, create a private s3 bucket and put the dynamsoft .zip file inside that bucket
  - On AWS, setup a role & policy for accessing the dynamsoft .zip file that is hosted on a private s3 bucket
     - The role name must match `dynamsoft_s3_download_role`, and it must be for `EC2`
     - The policy must have `s3:GetObject` access to your bucket

## Circle CI Setup
1. Set up a [CircleCI](https://circleci.com/) account
2. Click "Add Projects"
3. Click "Set Up Project" next to the court's repo
4. Click "Start Building" with defaults
5. Go to the settings of the project in CircleCI via clicking on the project / job, and clicking the gear icon
6. Click "Environment Variables"
7. Add the following:
     - `AWS_ACCESS_KEY_ID` (the access key for the AWS CircleCI user created in the Prerequisites)
     - `AWS_SECRET_ACCESS_KEY` (the secret access key for the AWS CircleCI user created in the Prerequisites)
     - `EFCMS_DOMAIN` (the domain indented for use by the court, e.g., `ef-cms.example.gov`)
     - `SONAR_ORG` (your sonar organization’s name)
     - `SHARED_SONAR_KEY` (the sonar key for the SHARED project)
     - `SHARED_SONAR_TOKEN` (the token for the sonar SHARED project)
     - `API_SONAR_KEY` (the sonar key for the API project)
     - `API_SONAR_TOKEN` (the token for the sonar API project)
     - `UI_SONAR_KEY` (the sonar key for the UI project)
     - `UI_SONAR_TOKEN` (the token for the sonar UI project)
     - `COGNITO_SUFFIX` (a suffix of your choice for the cognito url)
     - `USTC_ADMIN_PASS` (a unique password of your choice used by the cognito admin user)
     - `DYNAMSOFT_PRODUCT_KEYS_DEV` (the product key provided after purchasing dynamsoft)
     - `DYNAMSOFT_PRODUCT_KEYS_STG`  (the product key provided after purchasing dynamsoft)
     - `DYNAMSOFT_PRODUCT_KEYS_PROD`  (the product key provided after purchasing dynamsoft)
     - `DYNAMSOFT_S3_ZIP_PATH` (the full s3 path to the dynamsoft .tar.zip, e.g. `s3://ef-cms.ustaxcourt.gov-software/Dynamsoft/dynamic-web-twain-sdk-14.3.1.tar.gz`)
     - `CLOUDWATCH_ROLE_ARN` (the arn output after running terraform in the iam/account-specific/terraform/main dir)
     - `POST_CONFIRMATION_ROLE_ARN_DEV` (the arn output after running terraform in the iam/environment-specific/terraform/main dir)
     - `POST_CONFIRMATION_ROLE_ARN_STG` (the arn output after running terraform in the iam/environment-specific/terraform/main dir)
     - `POST_CONFIRMATION_ROLE_ARN_PROD` (the arn output after running terraform in the iam/environment-specific/terraform/main dir)
     - `SES_DMARC_EMAIL` (email address used with SES to which aggregate DMARC validations are sent)
8. Run a build.
