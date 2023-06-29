# Blue-Green Deploy and Migration Steps

![Migration Terraform](https://user-images.githubusercontent.com/1868782/117465361-9f83e400-af1f-11eb-8844-b14fefa2c3d2.png)

Every deployment, whether it's to production or a development environment, is a blue-green deployment. We build a copy for the resources that are required to run a second version of the application. When the copy is ready and tested, we switch the client over to run off of the newly deployed color and have the old color available for rolling back.

Additionally, for deployments that require change in the data schema or elasticsearch mappings in order for the application to function, we build an empty copy of the data stores (DynamoDB and Elasticsearch). Then we perform a migration of information from currently running DynamoDB database table (*source table*) into the newly created, empty one (*destination table*). This migration passes all of the data through a lambda to update and verify the data before saving it into the destination table.

## -> The Shortcut <-

You can run a migration with the following two steps:

1. Use the [environment switcher](docs/additional-resources/environment-switcher.md) to point to the environment where you're running a migration.
2. Run `./setup-for-blue-green-migration.sh --force`.

No additional manual steps are required.

## Automated Migration Steps

**All of the automated migration steps are now handled by CircleCI, as defined in `config.yml`.**

Some key steps, excluding automated tests, include:

### Manual Steps required before attempting an automated Migration

If the destination table exists in either `us-east-1` or `us-west=1`, you will have to delete it before kicking off a CircleCI deployment.

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

There are two good ways to trigger a manual migration. You can either [remove the record from the deploy table](#remove-record-of-previous-migration) of one of the previously run migrations, or you can [explicitly configure the deploy table to run a migration](#explicitly-configure-deploy-table) on next deploy.

The first step of either is to [delete the destination table](#delete-the-destination-tables)

### Delete the Destination Tables

We need to delete the destination tables (if they exist) in order to perform a blue green migration. It is preferred to delete the `west` table first mainly because we are using a  DynamoDB Global table and replication.

The `east` table is master table, and if you delete these tables and recreate them. You will be unable to delete the `east` table until you delete the `west` table. AWS will throw an error if you attempt to delete the `east` table before the `west` table if both exist and they have been deleted within the last 24 hours.

#### Via the command line

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
    aws dynamodb describe-table --table-name efcms-dev-alpha
    ```

    If you get an error, `An error occurred (ResourceNotFoundException) when calling the DescribeTable operation: Requested resource not found: Table: efcms-dev-alpha not found`, then you are ready to proceed with the deployment.

    If you do not, then it exists, and you must delete the table.

3. If it exists, delete the **destination table** in both `east` and `west`. You can do this via this handy script:

    ```bash
    ./scripts/dynamo/delete-dynamo-table.sh efcms-dev-alpha
    ```

    NOTE: after deleting the `west` table, you may have to wait a few minutes before you can delete the `east` table.


#### Via the console

1. Identify the source table and destination table. Both should be the same value, and that is what the application is currently using as it its main data store. If they are both `alpha`, then the destination table is `beta`. If they are both `beta`, the destination table is `alpha`. If they are different, inspect at the current color Lamdba's environment config to determine the dynamo table that the application is currently using as its data store.
2. Change the value for the `current` key of the `pk`:`destination-table-version` to the destination table you identified in step 3 (`alpha` or `beta`).
3. Switch to the `west-1` region.
4. Delete the destination table in `west`
5. Go back to east region
6. Delete the destination table in `east`; note this may take a few minutes as the west table is deleting.

### Remove Record of Previous Migration

1. Delete the Destination table [see instructions](#delete-the-destination-tables)
2. Remove a migration script item from the environment's `efcms-<ENV>-deploy` DynamoDB table that is expected to migrate, from the `migrationsToRun.ts` file. For example, if `migrationsToRun.ts` includes a script called `0001-test-script.ts`, delete that item from the DynamoDB table.
3. Kick off a CircleCI workflow, which will follow the steps above for Automated Migration Steps.

### Explicitly Configure Deploy Table

1. Go into the environment's deploy table `efcms-<ENV>-deploy`
2. Change the `migrate` flag to `true`
3. Identify the source table and destination table. Both should be the same value, and that is what the application is currently using as it its main data store. If they are both `alpha`, then the destination table is `beta`. If they are both `beta`, the destination table is `alpha`. If they are different, inspect at the current color Lamdba's environment config to determine the dynamo table that the application is currently using as its data store.
4. Change the value for the `current` key of the `pk`:`destination-table-version` to the destination table you identified in step 3 (`alpha` or `beta`).
5. Switch to the `west-1` region.
6. Delete the destination table in `west`
7. Go back to east region
8. Delete the destination table in `east`; note this may take a few minutes as the west table is deleting.
9. Kick off a CircleCI workflow, which will follow the steps above for Automated Migration Steps.

See [the troubleshooting guide](TROUBLESHOOTING.md) for solutions to problems that may arise during the migration process.
