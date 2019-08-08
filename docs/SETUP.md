# Setup for CircleCI CI/CD Pipeline

## Prerequisites
- [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/).
- Create a `CircleCI` user in [AWS Identity and Access Management](https://console.aws.amazon.com/iam/):
     - Determine your organization’s AWS ID, a 12-digit number. While logged into the AWS Console, you can find this in the account menu in the top right, where it may appear with hyphens, e.g. `3503-6506-1526`.
     - In your local copy of the repository, generate an IAM policy with `./generate-policy.sh [YOUR_ACCOUNT_ID]`, e.g. `generate-policy.sh 350365061526`.
     - Create a IAM policy called `CircleCIPolicy`, populating it with the contents of the generated `policy.json`.
     - Create the `CircleCI` user and attach the policy.
     - Keep track of the access key and secret access key — it is needed for the CircleCI setup.
- [Create a Route53 Hosted Zone](https://console.aws.amazon.com/route53/home) This will be used for setting up the domains for the UI and API.  Put the desired domain name (e.g. `ef-cms.example.gov.`) and make sure it is a `Public Hosted Zone`.  This is the value you will set for `EFCMS_DOMAIN` in CircleCI.  Make sure the domain name ends with a period.
- [Create a SonarCloud account](https://sonarcloud.io/). SonarCloud will be used to tests each build.
- [Create a new SonarCloud organization](https://sonarcloud.io/create-organization).
  - There are three sub-projects to the EF-CMS — the front-end (the UI), the back-end (the API), and shared code. Each is handled separately by Jenkins and SonarCloud.
  - [Create a project and project key](https://sonarcloud.io/projects/create?manual=true) for the UI. (This will be referred to as `UI_SONAR_TOKEN` when setting up Jenkins.)
  - [Create a project and project key](https://sonarcloud.io/projects/create?manual=true) for the API. (This will be referred to as `API_SONAR_TOKEN` when setting up Jenkins.)
  - [Create a project and project key](https://sonarcloud.io/projects/create?manual=true) for the SHARED code. (This will be referred to as `SHARED_SONAR_TOKEN` when setting up Jenkins.)
  - [Create a Github Access Token](https://github.com/settings/tokens) click "Generate new token" and keep track of the generated token.  This will be used later in the CircleCI setup.

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
     - `DYNAMSOFT_REPO` (the private github repo path for fetching the tarball, e.g., `https://api.github.com/repos/codyseibert/dynamsoft/tarball`)
     - `DYNAMSOFT_ZIP_NAME` (the name of the zip file which is zipped into the tarball, e.g., `codyseibert-dynamsoft-5bbf51a51de3717dfee641678d33f36e3cc857e7`)
     - `PRODUCT_KEYS` (the list of product keys provided by dynamsoft, e.g., `abc;123`)
     - `GIT_ACCESS_TOKEN` (a private access token which has access to the dynamsoft repo for fetching the tarball [Access Tokens](https://github.com/settings/tokens))
     - `SES_DMARC_EMAIL` (email address used with SES to which aggregate DMARC validations are sent)
8. Run a build.
