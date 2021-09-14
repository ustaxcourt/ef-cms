# Maintaining production-like data sets for test environments

From time to time the team feels that it makes sense to perform a glue job to refresh the information in `mig` or `test`. It is recommended to do this in advance of any final testing of a batch of stories, a significant bugfix, or a bugfix/story that has a Blue/Green Migration.

In order to do this, you need to have an empty DDB table in the environment to which you are sending the Glue Job. You may need to delete a table (east & west) and then re-deploy in order to get an empty DDB table to send information. I usually delete the table that is not the current source or destination table in the `efcms-deploy-{ENV}` table so that the environment can continue to function on the current table. Deleting a table in one region causes a replication event to happen to the other, so if you have trouble deleting the second regional table, wait a few minutes and try again.

1. Once the table is ready, perform the steps documented in [the Glue Job documentation](../../shared/admin-tools/glue/GLUE_JOBS.md). Expect the glue job to complete in about 6 – 7 hours.

2. After the glue job is completed, synchronize the us-east-1 S3 buckets containing documents to the target environment (the us-west-1 buckets will automatically replicate):

    ```bash
    aws s3 sync s3://dawson.ustaxcourt.gov-documents-prod-us-east-1 s3://test.ef-cms.ustaxcourt.gov-documents-test-us-east-1
    ```

3. Finally, you will need to do a [blue/green migration](../blue-green-migration.md) or run your deploy that may have a blue/green migration to index this information and get it working with the environment. During this deployment, the environment will be offline.
