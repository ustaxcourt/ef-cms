# Prerequisites

- must have JDK 8 installed

- `npm i`

# Contributing

- `npm start`

# Running Tests

- `npm test`

# Trouble Shooting

Sometimes you may get errors when doing npm install.  To fix, removce the package-lock.json file and re-run npm install.

## Sandbox Deploys to AWS

`EFCMS_DOMAIN=ustc-case-mgmt.flexion.us ENVIRONMENT=<yourname> REGION=us-east-1 ./deploy-sandbox.sh`

If you want to point your local ui to your sandbox, modify the API_URL in web-client/environments/dev.js to match the URL returned from the serverless deploy.

## Load and Smoke Testing with Artillery

To get the rest api id of the stage to test against auth to aws then run:

`aws apigateway get-rest-apis --region=${region} --query "items[?name=='${stage}-ef-cms'].id"`

Using that rest api id run:

`API_REGION=<region> API_TARGET=<rest-api-id> API_STAGE=<stage> artillery run ./smokeTest.yml`
