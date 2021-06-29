# DynamoDB Recovery

DynamoDB is the source-of-truth for the data in Dawson. In the event a table is lost, or data has become corrupt it may be necessary to restore the table from a backup. In its default configuration, Dawson’s DynamoDB tables have point-in-time recovery enabled. Point-in-time maintains continuous backups of  for the last 35 days. If you delete a table with point-in-time recovery enabled, a system backup is automatically created and is retained for 35 days.

**To restore Dawson from a backup:**
1. If possible, put the application in a state where new data will not be written to DynamoBD. New data created during the restore process will be lost.
2. Follow the directions in the [AWS documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery.Tutorial.html) to create a new, restored table. This takes a little more than one hour to complete at our current data size.
3. Ensure that either the alpha or beta DynamoDB and corresponding ElasticSearch cluster is empty.
4. Run the migration routine described in [BLUE_GREEN_MIGRATION.md](./BLUE_GREEN_MIGRATION.md) setting the source table as the newly-restored table and the empty alpha/beta table as the destination.

**Note:**
DynamoDB tables restored from backups do not retain many critical settings including stream triggers, and scaling settings. Because of this, you should not try to restore directly to the alpha/beta table.
