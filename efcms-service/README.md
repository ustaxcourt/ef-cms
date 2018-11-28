# Electronic Filing / Case Management System APIs

## Prerequisites

- [install JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- install Node dependencies: `npm i`
- install DynamoDB local: `npm run install:dynamodb`

## Optional prerequisites, if setting up a local sandbox

- `npm install -g serverless`
- [Install Terraform](https://www.terraform.io/intro/getting-started/install.html)

## Usage

### Starting Serverless-Offline

`npm start`

This will host a local service at http://localhost:3000.

### Running Unit Test Coverage on a Watcher

`npm run test:coverage:watch`

### Running the Full Build

`npm run build`

This is what Jenkins will run.

## API Gateway Execution and Access Request Execution Logging

Some manual steps are necessary, but only need to be done once for execution logging.

Go through [AWS’s “Set Up CloudWatch API Logging in API Gateway”](https://aws.amazon.com/premiumsupport/knowledge-center/api-gateway-cloudwatch-logs/).

In general, you need to:

1.  [Create a new IAM role](https://console.aws.amazon.com/iam/home?region=us-east-1#/roles$new?step=type) (for example, `apigateway-cloudwatch-logs-role`) with trust policy `apigateway.amazonaws.com`
2.  Attach AWS’s existing `AmazonAPIGatewayPushToCloudWatchLogs` policy to this role.
3.  Note this IAM role’s ARN.
4.  Add the role’s ARN to [`API Gateway` -> `Settings` -> `CloudWatch log role ARN\*`](https://console.aws.amazon.com/apigateway/home?region=us-east-1#/settings)

Cloudwatch log is `API-Gateway-Execution-Logs\_<rest-api-id>/<stage>`.

## Usage

See the `Jenkinsfile`.

In general:
```sh
$cd stageDir && terraform init && terraform apply
$serverless deploy --stage myStageName
```

## Sandbox Deploys to AWS

Run `EFCMS_DOMAIN=ustc-case-mgmt.example.gov ENVIRONMENT=<yourname> REGION=us-east-1 ./deploy-sandbox.sh`, substituting your domain for `ustc-case-mgmt.example.gov`.

Modify `API_URL` in `web-client/environments/dev.js` to match the URL returned from the serverless deploy.

Update the name of the service in `deploy-sandbox.sh` to match your service name from `serverless.yml`.

## Serverless Local

See “[Running AWS Lambda and API Gateway locally: serverless-offline](https://medium.com/a-man-with-no-server/running-aws-lambda-and-api-gateway-locally-serverless-offline-3c64b3e54772)” for background. Note that Docker is required.

1. `npm run install:lambda` install Docker for Lambda to run locally with serverless-local
2. `npm run install:dynamodb` install a local DynamoDB (optional)
3. `npm run start:dynamodb` run DynamoDB on port 8000 (optional)
4. `npm run start:local` in another terminal to run the serverless-local on 3000

## Load and Smoke Testing with Artillery

To get the REST API ID of the stage to test against auth to AWS, run:

`aws apigateway get-rest-apis --region=${region} --query "items[?name=='${stage}-ef-cms'].id"`

Using that REST API ID, run:

`API_REGION=<region> API_TARGET=<rest-api-id> API_STAGE=<stage> artillery run ./smokeTest.yml`
