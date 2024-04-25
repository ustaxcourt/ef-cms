# Blue-Green Deploy and Migration Steps

![Migration Terraform](https://user-images.githubusercontent.com/1868782/117465361-9f83e400-af1f-11eb-8844-b14fefa2c3d2.png)

Every deployment, whether it's to production or a development environment, is a blue-green deployment. We build a copy of the resources that are required to run a second version of the application. When the copy is ready and tested, we switch the client over to run off of the newly deployed color and have the old color available for rolling back.

Additionally, for deployments that require change in the data schema or elasticsearch mappings in order for the application to function, we build an empty copy of the data stores (DynamoDB and Elasticsearch). Then we perform a migration of information from currently running DynamoDB database table (*source table*) into the newly created, empty one (*destination table*). This migration passes all of the data through a lambda to update and verify the data before saving it into the destination table.

# Preparation for a Migration

## Automated Preparation Steps

You can prepare an environment for a migration with the following two steps:

1. Use the [environment switcher](docs/additional-resources/environment-switcher.md) to point to the environment where you're running a migration.
2. Run `./setup-for-blue-green-migration.sh --force`.

## Manual Preparation Steps

The application kicks off a migration automatically if it detects migrations that need to be run in the codebase that haven't yet been run upon that environment. In order to force a migration, perform the following manual steps. You might do this if you were doing a package update that might impact the migration and wanted to test it fully.

The first step is to [delete the destination table](#delete-the-destination-tables)

### Delete the Destination Tables

We need to delete the destination tables (if they exist) in order to perform a blue green migration. It is recommended to delete the `west` table first because we are using DynamoDB Global tables with replication.

The `east` table is main table. AWS will throw an error if you attempt to delete the `east` table before the `west` table if both exist and they have been deleted within the last 24 hours.

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


#### Via the AWS Console

1. Identify the source table and destination table. Both should be the same value, and that is what the application is currently using as it its main data store. If they are both `alpha`, then the destination table is `beta`. If they are both `beta`, the destination table is `alpha`. If they are different, inspect at the current color Lamdba's environment config to determine the dynamo table that the application is currently using as its data store.
2. Switch to the `west-1` region.
3. Delete the destination table in `west`
4. Go back to east region
5. Delete the destination table in `east`; note this may take a few minutes as the west table is deleting.

### Delete the Destination Opensearch Cluster
1. Using the identified **destination table** version from the steps above, check if an Opensearch cluster exists for the environment you are working in and the destination version.
2. If the cluster exists, delete it and wait until it has been fully deleted before moving on to the next step.

# Running a Migration

There are two good ways to trigger a migration. You can either remove a migration script record from the deploy table, or you can explicitly configure the deploy table to run a migration on next deploy.

## Remove Record of Previous Migration

1. Remove a migration script item from the environment's `efcms-<ENV>-deploy` DynamoDB table that is expected to migrate, from the `migrationsToRun.ts` file. For example, if `migrationsToRun.ts` includes a script called `0001-test-script.ts`, delete that item from the DynamoDB table.

## Explicitly Configure Deploy Table

1. Go into the environment's deploy table `efcms-<ENV>-deploy`.
2. Change the `migrate` flag to `true`.
4. Change the value for the `current` key of the `pk`:`destination-table-version` to the destination table you identified in the preparation steps(`alpha` or `beta`).
8. Delete the destination table in `east`; note this may take a few minutes as the west table is deleting.

After either removing a record of a previous migration, or explicitly configuring the deploy table, kick off a CircleCI deploy to begin the migration.

See [the troubleshooting guide](TROUBLESHOOTING.md) for solutions to problems that may arise during the migration process.
