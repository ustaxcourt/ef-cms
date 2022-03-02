# Blue-Green Deploy and Migration Steps

![Migration Terraform](https://user-images.githubusercontent.com/1868782/117465361-9f83e400-af1f-11eb-8844-b14fefa2c3d2.png)

Every deployment, whether it's to production or a development environment, is a blue-green deployment. We build a copy for the resources that are required to run a second version of the application. When the copy is ready and tested, we switch the client over to run off of the newly deployed color and have the old color available for rolling back.

Additionally, for deployments that require change in the data schema or broad stroke changes to the database in order for the application to function, we build an empty copy of the data stores (DynamoDB and Elasticsearch). Then we perform a migration of information from the old data store into the newly created one. This migration passes all of the data through a lambda to update and verify the data before saving it into a new data store.

## Automated Migration Steps
---

<b>All of the automated migration steps are now handled by CircleCI, as defined in `config.yml`. </b>

Some key steps, excluding automated tests, include:

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
- Destroy the migration and migration-cron infrastructure.
- Delete the source's ElasticSearch domain.
- Delete the source's DynamoDB table in `east` and `west` regions.
- Toggle the deploy table's values for `migrate` and `source-table-version`.


## Manual Migration Steps
---
The application kicks off a migration automatically if it detects migrations that need to be run in the codebase that haven't yet been run upon that environment. In order to force a migration, perform the following manual steps. You might do this if you were doing a package update that might impact the migration and wanted to test it fully.

1. Remove a migration script item from the environment's `efcms-<ENV>-deploy` DynamoDB table that is expected to migrate, from the `migrationsToRun.js` file. For example, if `migrationsToRun.js` includes a script called `0001-test-script.js`, delete that item from the DynamoDB table.
2. Kick off a CircleCI workflow, which will follow the steps [above](#automated-migration-steps to automatically determine that a migration is required.

<!-- This is used most often to perform a complete re-index of information into Elasticsearch.

1. Change the `destination-table-version` to the alternate of `alpha` or `beta` depending on whatever the `source-table-version` is in the `efcms-<ENV>-deploy` table. For instance, if the application is currently running on `alpha`, both the `source-table-version` and `destination-table-version` would be `alpha`. In this case, change the `destination-table-version` to `beta`.

2. Change the value of the database record with the key of `migrate` to `true`. The system will automatically change this back to `false` after completing the migration.
-->

See [the troubleshooting guide](TROUBLESHOOTING.md) for solutions to problems that may arise during the migration process.
