# Blue-Green Deploy and Migration Steps

![Migration Terraform](https://user-images.githubusercontent.com/1868782/117465361-9f83e400-af1f-11eb-8844-b14fefa2c3d2.png)

Every deployment, whether it's to production or a development environment, is a blue-green deployment. We build a copy for the resources that are required to run a second version of the application. When the copy is ready and tested, we switch the client over to run off of the newly deployed color and have the old color available for rolling back.

Additionally, for deployments that require change in the data schema or elasticsearch mappings in order for the application to function, we build an empty copy of the data stores (DynamoDB and Elasticsearch). Then we perform a migration of information from currently running DynamoDB database table (*source table*) into the newly created, empty one (*destination table*). This migration passes all of the data through a lambda to update and verify the data before saving it into the destination table.

## Automated Migration Steps

**All of the automated migration steps are now handled by CircleCI, as defined in `config.yml`.**

Some key steps, excluding automated tests, include:

### Manual Steps required before attempting an automated Migration

If the destination table exists in either `us-east-1` or `us-west=1`, you will have to delete it before kicking off a CircleCI deployment.

1. Identify the **destination table**. For example, if we're performing a deployment to `dev`:

    ```bash
    $ ./scripts/dynamo/get-source-table.sh dev
    efcms-dev-beta
    $ ./scripts/dynamo/get-destination-table.sh dev
    efcms-dev-beta
    ```

    Both should be the same value, and that is what the application is currently using as it its main data store. If they are both `alpha`, then the destination table is `beta`. If they are both `beta`, the destination table is `alpha`.

    If they are different, inspect the Lamdba's environment config to determine what table the application is currently using. If that is `beta`, then the destination table is `alpha`, and vice versa.

2. Check to see if the **destination table** exists. You can do this via the AWS Console or AWS CLI:

    ```bash
    $ aws dynamodb describe-table --table-name efcms-dev-alpha
    ```

    If you get an error, `An error occurred (ResourceNotFoundException) when calling the DescribeTable operation: Requested resource not found: Table: efcms-dev-alpha not found`, then you are ready to proceed with the deployment.

    If you do not, then it exists, and you must delete the table.

3. If it exists, delete the **destination table** in both `east` and `west`. You can do this via the AWS Console or AWS CLI:

    ```bash
    $ aws dynamodb delete-table --table-name efcms-dev-alpha --region us-west-1
    $ aws dynamodb delete-table --table-name efcms-dev-alpha --region us-east-1
    ```

    NOTE: after deleting the `west` table, you may have to wait a few minutes before you can delete the `east` table.

### Deploy, Migrate, and Reindex

- Deploy updated infrastructure.
- `migrate` is automatically determined if there are expected migration scripts that do not exist in the DynamoDB table.
  - Disable destination table stream.
  - Migration runs.
  - SQS queue empties.
  - Enable destination table stream.
- ElasticSearch reindexes, and a cron runs to determine if the reindex completes. This will approve the next step in the workflow to run.

### Post-successful Deploy

- Switch the current color and deployed color.
- If deploying the `prod` environment, backup the source's DynamoDB table.
- Delete the source's API gateway mappings, both non-public and public.
- Destroy the migration and migration-cron infrastructure.
- Delete the source's ElasticSearch domain.
- Delete the source's DynamoDB table in `east` and `west` regions.
- Toggle the deploy table's values for `migrate` and `source-table-version`.

## Manual Migration Steps

The application kicks off a migration automatically if it detects migrations that need to be run in the codebase that haven't yet been run upon that environment. In order to force a migration, perform the following manual steps. You might do this if you were doing a package update that might impact the migration and wanted to test it fully.

1. Go into the environment's deploy table `efcms-<ENV>-deploy`
2. Change the `migrate` flag to `true`
3. Identify the source table and destination table. Both should be the same value, and that is what the application is currently using as it its main data store. If they are both `alpha`, then the destination table is `beta`. If they are both `beta`, the destination table is `alpha`. If they are different, inspect at the current color Lamdba's environment config to determine the dynamo table that the application is currently using as its data store.
4. Switch to the `west-1` region.
5. Delete the destination table in `west`
6. Go back to east region
7. Delete the destination table in `east`; note this may take a few minutes as the west table is deleting.
8. Kick off a CircleCI workflow, which will follow the steps above for Automated Migration Steps.

See [the troubleshooting guide](TROUBLESHOOTING.md) for solutions to problems that may arise during the migration process.
