# Blue-Green Deploy and Migration Steps

![Migration Terraform](https://user-images.githubusercontent.com/1868782/117465361-9f83e400-af1f-11eb-8844-b14fefa2c3d2.png)

Every deployment, whether it's to production or a development environment, is a blue-green deployment. We build a copy for the resources that are required to run a second version of the application. When the copy is ready and tested, we switch the client over to run off of the newly deployed color and have the old color available for rolling back.

Additionally, for deployments that require change in the data schema or broad stroke changes to the database in order for the application to function, we build an empty copy of the data stores (DynamoDB and Elasticsearch). Then we perform a migration of information from the old data store into the newly created one. This migration passes all of the data through a lambda to update and verify the data before saving it into a new data store.

## Automated Migration Steps

This process is mostly automated.

1. Setup the destination environments.  Refer to DynamoDB `efcms-ENV-deploy`  table and figure out the destination table version.  If `source-table-version` is `beta`, you would need to delete the `efcms-<ENV>-alpha` DynamoDB tables (us-east-1 and us-west-1) as well as the `efcms-search-<ENV>-alpha` Elasticsearch Cluster, and vice versa.

    - delete the `efcms-<ENV>-<VERSION>` DynamoDB tables on us-east-1 and us-west-1
    - delete the `efcms-search-<ENV>-<VERSION>` ElasticSearch cluster

    **NOTE:** if you encounter an error trying to delete the DynamoDB table due to a 24-hour restriction, try deleting the `west` table before the `east` table.

2. Run a circle deploy


3. Destroy the Migration infrastructure (the SQS queues):

    ```bash
    npm run destroy:migration -- ${ENV}
    ```

## Manual Migration Steps

The application kicks off a migration automatically if it detects migrations that need to be run in the codebase that haven't yet been run upon that environment. In order to force a migration, perform the following manual steps. This is used most often to perform a complete re-index of information into Elasticsearch.

1. Change the `destination-table-version` to the alternate of `alpha` or `beta` depending on whatever the `source-table-version` is in the `efcms-ENV-deploy` table. For instance, if the application is currently running on `alpha`, both the `source-table-version` and `destination-table-version` would be `alpha`. In this case, change the `destination-table-version` to `beta`.
2. Change the value of the database record with the key of `migrate` to `true`. The system will automatically change this back to `false` after completing the migration.
3. Perform the steps above for an [automated migration](#automated-migration-steps).

## Deploying a brand new environment

1. Setup account specific infrastructure if it has not already been run for the account.
    ```bash
    npm run deploy:account-specific
    ```
2. Setup environment specific infrastructure
    ```bash
    npm run deploy:environment-specific <ENV>
    ```
3. Attempt to run a deploy on circle. The deploy will fail on the deploy web-api step. In order to resolve the error, run:
    ```bash
    ./setup-s3-deploy-files.sh <ENV>
    ```
    ```bash
    ./setup-s3-maintenance-file.sh <ENV>
    ```
    ```bash
   ./web-api/verify-ses-email.sh
    ```
4. Setup the environment's migrate flag:
    ```bash
    aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"migrate"},"sk":{"S":"migrate"},"current":{"BOOL":true}}'
    ```
5. Setup the environment's order search flag:
    ```bash
    ./scripts/setup-order-search-flag.sh <ENV>
    ```
6. Setup the environment's source table version:
    ```bash
    aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"source-table-version"},"sk":{"S":"source-table-version"},"current":{"S":"alpha"}}'
    ```
7. Setup the environment's destination table version:
    ```bash
    aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"destination-table-version"},"sk":{"S":"destination-table-version"},"current":{"S":"beta"}}'
    ```
8. Set the environment's maintenance-mode flag to **false**:
    ```bash
    aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"maintenance-mode"},"sk":{"S":"maintenance-mode"},"current":{"BOOL": false}}'
    ```
9. Delete the destination DynamoDB tables from us-east-1 and us-west-1. 
10. Delete the destination ElasticSearch cluster from us-east-1.
11. Rerun the circle deploy from step 4
12. If the environment is NOT prod, setup test users and judges so smoketests will pass:
    ```bash
    node shared/admin-tools/user/setup-test-users.js
    ```
    ```bash
    cd web-api/
    ./bulk-import-judge-users.sh <ENV> judge_users.csv
    ```

## Known Issues

- Route53 Error
    ```
    Error: [ERR]: Error building changeset: InvalidChangeBatch: [Tried to create resource record set [name='_243f260ea635a6dffe0db2c6cc1c1158.*************************.', type='CNAME'] but it already exists]
    ```
    Solution: Manually delete the Route53 record and rerun the deploy.

- IAM Role already exists
    ```
    Error: Error creating IAM Role migration_role_<ENV>: EntityAlreadyExists: Role with name 		migration_role_<ENV> already exists.
        status code: 409, request id: ***********

    on migration.tf line 1, in resource "aws_iam_role" "migration_role":
    1: resource "aws_iam_role" "migration_role" {
    ```
    Solution: Delete the role in the AWS IAM console and rerun: 
    ```bash
    npm run deploy:environment-specific <ENV>
    ````
- Failing smoke tests

    Solution: When this is run for the first time on a new environment, the smoke tests may fail for up to an hour after the initial deploy due to the header security lambda redeploying to all edge locations. To resolve, wait an hour and rerun the smoke tests.

 