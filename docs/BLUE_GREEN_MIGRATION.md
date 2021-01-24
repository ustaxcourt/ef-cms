# Blue-Green Deploy and Migration Steps

## Manual Migration Steps

For Production (`ENV` would be `prod`), this process is entirely manual. For the `test` and `mig` environments, steps 7 and 8 are manual. Additionally, for `stg`, `irs`, or `dev` steps 7 and 8 are manual if the deployment process does not complete the smoke tests step.

Here are the steps involved:

1. Ensure you have the right values in the `efcms-deploy-ENV` DynamoDB table:
   - `migrate`: `true`
   - `destination-table-version`: `beta` (or `alpha`; it's the alternative to the current value of `source-table-version`)

     This is the suffix for the DynamoDB table (`efcms-ENV-SUFFIX`) that will contain all of the records after the deployment is complete. It should be empty. As should its accompanying Elasticsearch cluster.

   - `source-table-version`: `alpha` (or `beta`; this value gets automatically updated upon the `switch-colors` step below. You should never have to change it)

     This is the suffix for the DynamoDB table (`efcms-ENV-SUFFIX`) that contains the records for the application. Any writes to it during the migration, should be caught via the DynamoDB stream subscription and passed over to the destination table. We might be able to use other values if restoring from a backup.

2. Ensure you have the proper environmental variables set:
   - `ENV`: The environment receiving the migration
   - `MIGRATE_FLAG`: You should set this to `true` if you are performing a migration
   - `DESTINATION_TABLE`: This is the DynamoDB table receiving the update. Depending on what you specified above: `efcms-ENV-alpha` or `efcms-ENV-beta`
   - `SOURCE_TABLE`: This is the DynamoDB table from which information will be migrated. `efcms-ENV-alpha` or `efcms-ENV-beta`
   - `ZONE_NAME`: The Hosted Zone for the install (e.g., `ef-cms.ustaxcourt.gov`)
   - `EFCMS_DOMAIN`: The Domain for the environment (e.g., `mig.ef-cms.ustaxcourt.gov`)
   - `AWS_ACCESS_KEY_ID`: Your AWS credentials
   - `AWS_ACCESS_SECRET_ACCESS_KEY`: Your AWS credentials
3. Because you are deploying the migration infrastructure from your machine, **you MUST be on the latest version of the codebase** branch checked out in order for this to work!

   ```bash
   git checkout staging
   git pull
   ```

4. Deploy the migration infrastructure with the following script. This sets up the SQS queues and Lambdas to perform the migration:

    ```bash
    npm run deploy:migration -- ${ENV}
    ```

5. Using AWS CLI, set the `STREAM_ARN` environmental with the following command:

    ```bash
    export STREAM_ARN=$(aws dynamodbstreams list-streams --region us-east-1 --query "Streams[?TableName=='${SOURCE_TABLE}'].StreamArn | [0]" --output text)
    ```

6. Kickoff the the migration scripts by sending items to the SQS queue:

    ```bash
    npm run start:migration -- ${ENV}
    ```

7. This next script will run until the SQS Queue is empty. You can also monitor this in the AWS Console by going to **Amazon SQS** > **Queues** > **migration_segments_queue_ENV**, and then clicking the Monitoring tab

    ```bash
    ./wait-for-migration-to-finish.sh
    ```

    Keep an eye out for errors in the logs for the Lambda (More info!). 

    And look for items in the **migration_segments_queue_ENV_dl** This is the Dead Letter Queue. These items may need to be run again. Errors may need to be handled. If they cannot be solved, we may need to adjust the migration script(s) and re-run the migration.

8. Finally, destroy the Migration infrastructure (the SQS queues):

    ```bash
    npm run destroy:migration -- ${ENV}
    ```

9. When complete, Elasticsearch is probably busily reindexing the newly migrated DB. When you are ready to accept the deployment, perform the following command to switch the colors:

    ```bash
    npm run switch-colors -- $ENV
    ```

## First Time Deployment

If this is the first time running a blue/green deployment on the environment:

1. Ensure you have `COGNITO_SUFFIX` environment variables properly set
2. Run `npm run deploy:account-specific` if it has not already been run for the account.
3. Ensure you have `ZONE_NAME` and `EFCMS_DOMAIN` environment variables properly set
4. Run `npm run deploy:environment-specific <ENV>`
5. Delete the environment's lambda S3 bucket and 4 UI S3 buckets:
   - `<ENV>.<ZONE_NAME>.<ENV>.us-east-1.lambdas`
   - `app.<ENV>.<ZONE_NAME>`,
   - `<ENV>.<ZONE_NAME>`,
   - `app-failover.<ENV>.<ZONE_NAME>`,
   - `failover.<ENV>.<ZONE_NAME>`, and
6. Attempt to run a deploy on circle. The deploy will fail on the deploy web-api terraform step. In order to resolve the error, run `./setup-s3-deploy-files.sh <ENV>`.
7. Run the following command to set the environment's migrate flag to **true**:
    ```aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"migrate"},"sk":{"S":"migrate"},"current":{"S":"true"}}'```
8. Run the following command to set the environment's initial version (`${VERSION}` being the current version of the migrations, which you can tell in [this terraform file](web-api/terraform/template/main.tf)):
    ```aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"destination-table-version"},"sk":{"S":"destination-table-version"},"current":{"S":"${VERSION}"}}'```
9. Run the following command to set the environment's migrate flag to **false** (for next time):
    ```aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"migrate"},"sk":{"S":"migrate"},"current":{"S":"false"}}'```

## If a Migration is not necessary

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
