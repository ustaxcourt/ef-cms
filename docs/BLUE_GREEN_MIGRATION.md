# Blue-Green Deploy and Migration Steps

## First Time Deployment

If this is the first time running a blue/green deployment on the environment:

1. Ensure you have `COGNITO_SUFFIX` environment variables properly set
2. Run `npm run deploy:account-specific` if it has not already been run for the account.
3. Ensure you have `ZONE_NAME` and `EFCMS_DOMAIN` environment variables properly set
4. Run `npm run deploy:environment-specific <ENV>`
5. Delete the environment's lambda S3 bucket and 4 UI S3 buckets:
   * `<ENV>.<ZONE_NAME>.<ENV>.us-east-1.lambdas`
   * `app.<ENV>.<ZONE_NAME>`,
   * `<ENV>.<ZONE_NAME>`,
   * `app-failover.<ENV>.<ZONE_NAME>`,
   * `failover.<ENV>.<ZONE_NAME>`, and
6. Attempt to run a deploy on circle. The deploy will fail on the deploy web-api terraform step. In order to resolve the error, run `./setup-s3-deploy-files.sh <ENV>`.
7. Run the following command to set the environment's migrate flag to **true**:
	```aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"migrate"},"sk":{"S":"migrate"},"current":{"S":"true"}}'```
8. Run the following command to set the environment's initial version (`${VERSION}` being the current version of the migrations, which you can tell in [this terraform file](web-api/terraform/template/main.tf)):
	```aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"destination-table-version"},"sk":{"S":"destination-table-version"},"current":{"S":"${VERSION}"}}'```
9. Run the following command to set the environment's migrate flag to **false** (for next time):
	```aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"migrate"},"sk":{"S":"migrate"},"current":{"S":"false"}}'```

## If a Migration is necessary

If it's time to run a migration, perform the following steps:

1. Run the following command to set the environment's migrate flag to **true**:
	```aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"migrate"},"sk":{"S":"migrate"},"current":{"S":"true"}}'```
2. If `destination-table-version` and `source-table-version` do not exist in the deploy table, create destination-table-version record using this command:
	```aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"destination-table-version"},"sk":{"S":"destination-table-version"},"current":{"S":"1"}}'```
3. If `destination-table-version` and `source-table-version` do exist in the deploy table, increment destination-table-version by 1.

## If a Migration is not necessary

Still figuring this out and testing

1. Run the following command to set the environment's migrate flag to **false**:
	```aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"migrate"},"sk":{"S":"migrate"},"current":{"S":"false"}}'```

## If a new DynamoDB table and Elasticsearch domain is necessary

If a new dynamo table and elasticsearch domain is necessary, duplicate the modules found in `web-api/terraform/template/main.tf`. Be sure to update the version number at the end of the module names, `table_name`, and `domain_name`. Do not delete the old modules. Add the modules to `depends_on` in `main-east.tf` and `main-west.tf`

1. Run a deploy in circle.
2. Verify the new application works at: 
	- https://<DEPLOYED_COLOR>-<ENV>.<ZONE_NAME>
	- https://app-<DEPLOYED_COLOR>.<ENV>.<ZONE_NAME>
3. Destroy the migration infrastructure to turn off the live streams
	`DESTINATION_TABLE=b SOURCE_TABLE=a STREAM_ARN=abc npm run destroy:migration -- <DEPLOYED_ENV>`

## Deploying to Prod

You will have to manually run `switch-colors.sh`. Before you run, set the following values:
	ENV=prod
	EFCMS_DOMAIN=dawson.flexion.us
	ZONE_NAME=dawson.flexion.us

Ensure you have DEPLOYING_COLOR and CURRENT_COLOR set to appropriate values in your local environment.

## Errors You May Encounter

### AWS-related

#### Route53 Error

```
Error: [ERR]: Error building changeset: InvalidChangeBatch: [Tried to create resource record set [name='_243f260ea635a6dffe0db2c6cc1c1158.*************************.', type='CNAME'] but it already exists]
```
Manually delete the Route53 record and rerun the deploy.


#### IAM Role already exists

```
Error: Error creating IAM Role migration_role_<ENV>: EntityAlreadyExists: Role with name 		migration_role_<ENV> already exists.
	status code: 409, request id: ***********

  on migration.tf line 1, in resource "aws_iam_role" "migration_role":
   1: resource "aws_iam_role" "migration_role" {
```

Delete the role in the AWS IAM console and rerun `npm run deploy:environment-specific <ENV>`.

#### Failing smoke tests

When this is run for the first time on a new environment, the smoke tests may fail for up to an hour after the initial deploy due to the header security lambda redeploying to all edge locations. To resolve, wait an hour and rerun the smoke tests.

#### 403 on websockets endpoint

If the websockets endpoint returns a 403 Unauthorized error (can be seen during trial session smoke tests), redeploy the websocket APIs for the environment in the AWS console under API Gateway (both east and west).
