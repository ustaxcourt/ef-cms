# Electronic Filing / Case Management System APIs

## Prerequisites

- [install JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- install Node dependencies: `npm i`

## Optional prerequisites, if setting up a local sandbox

- `npm install -g serverless`
- [Install Terraform](https://www.terraform.io/intro/getting-started/install.html)

### Starting Serverless-Offline

`npm start`

This will host a local service at http://localhost:3000.

### Running Unit Tests with Coverage

- `npm test`

# Trouble Shooting

Sometimes you may get errors when doing npm install.  To fix, removce the package-lock.json file and re-run npm install.

## Sandbox Deploys to AWS

Run `EFCMS_DOMAIN=ustc-case-mgmt.example.gov ENVIRONMENT=<yourname> REGION=us-east-1 ./deploy-sandbox.sh`, substituting your domain for `ustc-case-mgmt.example.gov`.

If you want to point your local ui to your sandbox, modify the API_URL in web-client/environments/dev.js to match the URL returned from the serverless deploy.

## Load and Smoke Testing with Artillery

To get the REST API ID of the stage to test against auth to AWS, run:

`aws apigateway get-rest-apis --region=${region} --query "items[?name=='${stage}-ef-cms'].id"`

Using that REST API ID, run:

`API_REGION=<region> API_TARGET=<rest-api-id> API_STAGE=<stage> artillery run ./smokeTest.yml`
