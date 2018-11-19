# Prerequisites

`npm install -g serverless`

Install [terraform](https://www.terraform.io/intro/getting-started/install.html)

`npm i`

# Contributing

1. `npm start`

## API Gateway Execution and Access Request Logging Note

### Execution Logging

Some manual steps are necessary prior but only need to be done once for execution logging.

Go through this [document](https://aws.amazon.com/premiumsupport/knowledge-center/api-gateway-cloudwatch-logs/).

   In general, you need to:

   1. Create a new IAM role (for example, apigateway-cloudwatch-logs-role) with trust policy apigateway.amazonaws.com
   2. Attach aws exist policy AmazonAPIGatewayPushToCloudWatchLogs to this role
   3. Record this IAM role’s ARN
   4. Add this role’s arn to apigateway -> settings -> CloudWatch log role ARN*

Cloudwatch log is API-Gateway-Execution-Logs_<rest-api-id>/<stage>

# Usage

See the Jenkinsfile.

In general:

    $cd stageDir && terraform init && terraform apply
    $serverless deploy --stage myStageName



# Contribution

### Starting Serverless Offline

`npm start`

^ this will host a local service at http://localhost:3000

### Running Unit Test Coverage on a Watcher

`npm run test:coverage:watch`

### Running the Full Build (What Jenkins will Run)

`npm run build`

## Sandbox Deploys to AWS

`ENVIRONMENT=<yourname> ./deploy-Sandbox.sh`

Modify the API_URL in web-client/environments/dev.js to match the URL returned from the serverless deploy.

Update the name of the service in the deploy-sandbox.sh script to match your service name from the serverless.yml

## Serverless Local

- see https://medium.com/a-man-with-no-server/running-aws-lambda-and-api-gateway-locally-serverless-offline-3c64b3e54772
for background.  NOTE: Docker is required.

1. `npm run install:lambda` install docker for lambda to run locally with serverless-local
2. `npm run install:dynamodb` install a local dynamodb (optional)
3. `npm run start:dynamodb` run the dynamodb on port 8000 (optional)
4. `npm run start:local` in another terminal run the serverless-local on 3000


## Load and Smoke Testing with Artillery

To get the rest api id of the stage to test against auth to aws then run:

`aws apigateway get-rest-apis --region=${region} --query "items[?name=='${stage}-ef-cms'].id"`

Using that rest api id run:

`API_REGION=<region> API_TARGET=<rest-api-id> API_STAGE=<stage> artillery run ./smokeTest.yml`