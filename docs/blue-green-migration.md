# Blue-Green Deploy and Migration Steps

![Migration Terraform](https://user-images.githubusercontent.com/1868782/117465361-9f83e400-af1f-11eb-8844-b14fefa2c3d2.png)

Every deployment, whether it's to production or a development environment, is a blue-green deployment. We build a copy for the resources that are required to run a second version of the application. When the copy is ready and tested, we switch the client over to run off of the newly deployed color and have the old color available for rolling back.

Additionally, for deployments that require change in the data schema or broad stroke changes to the database in order for the application to function, we build an empty copy of the data stores (DynamoDB and Elasticsearch). Then we perform a migration of information from the old data store into the newly created one. This migration passes all of the data through a lambda to update and verify the data before saving it into a new data store.

## Automated Migration Steps

1. Setup the destination environments.  Refer to DynamoDB `efcms-<ENV>-deploy` table and figure out the destination table version. For example, `source-table-version` is `beta`, you would need to delete the `efcms-<ENV>-alpha` DynamoDB tables (us-east-1 and us-west-1) as well as the `efcms-search-<ENV>-alpha` Elasticsearch Cluster, and vice versa.

    - delete the `efcms-<ENV>-<DESTINATION_VERSION>` DynamoDB tables on us-east-1 and us-west-1
    - delete the `efcms-search-<ENV>-<DESTINATION_VERSION>` ElasticSearch cluster

    **NOTE:** if you encounter an error trying to delete the DynamoDB table due to a 24-hour restriction, try deleting the `west` table before the `east` table.

2. Run a circle deploy

3. Destroy the Migration infrastructure (the SQS queues):
    ```bash
    npm run destroy:migration -- ${ENV}
    ```


## Manual Migration Steps

The application kicks off a migration automatically if it detects migrations that need to be run in the codebase that haven't yet been run upon that environment. In order to force a migration, perform the following manual steps. This is used most often to perform a complete re-index of information into Elasticsearch.

1. Change the `destination-table-version` to the alternate of `alpha` or `beta` depending on whatever the `source-table-version` is in the `efcms-<ENV>-deploy` table. For instance, if the application is currently running on `alpha`, both the `source-table-version` and `destination-table-version` would be `alpha`. In this case, change the `destination-table-version` to `beta`.

2. Change the value of the database record with the key of `migrate` to `true`. The system will automatically change this back to `false` after completing the migration.

3. Perform the steps above for an [automated migration](#automated-migration-steps).

See [the troubleshooting guide](TROUBLESHOOTING.md) for solutions to problems that may arise during the migration process.
