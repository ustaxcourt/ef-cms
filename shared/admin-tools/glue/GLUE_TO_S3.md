# Exporting DynamoDB Table to S3 for Analysis with Athena

AWS Glue can quickly export DynamoDB data to S3. When this data is exported in the Parquet file format, SQL queries can be performed over the data efficiently with Athena. This works because Parquet stores data in a columnar format allowing for efficient filtering of data without reading the entire dataset.

An AWS Step Function is used to orchestrate the process. It has two steps:
- Reading the correct alpha|beta table from DynamoDB
- Running the Glue job that reads from the correct DynamoDB table and writes it to S3

As of this writing the Glue job takes a little less than 15 minutes to complete.

## Refreshing Data
The step function that controls this is not currently set to run automatically (although it is possible to trigger it with a cron-like job). To export data and refresh the S3 Parquet files, simple navigate to the Step Functions in the AWS Console, click the function `Run_Glue_Dynamo_to_S3` and on the next page click `start execution`.

At this point the Glue job should be running. You can monitor it in the AWS Glue console but clicking `Jobs -> dynamo-to-parquet`.

Step function can also be started with the aws CLI using the `start-execution` command. For example:

```
aws start-execution --name Run_Glue_Dynamo_to_S3
```

## Using Athena
After the job is complete, S3 should contain the entire dataset in Parquet format. 

Athena is available in the AWS console with a easy interface that allows you to directly enter queries. The Glue job writing the data to S3 makes no attempt to break the data into separate tables. DynamoDB is represented as on *very wide* table. 

For efficient queries, it is advisable to filter and limit to data to only the things you need. This avoids scanning all the data. For example, to find the cases with the most docket entries:

```
SELECT docketnumber, count(*) as cnt 
FROM "efcms-schemas"."aws_glue_efcms_dynamodb_exports"
WHERE entityname='DocketEntry'
group by docketnumber order by cnt desc limit 5;
```

By limiting the data with `entityname='DocketEntry'` and futher limiting to five results we only need to scan and group the single column in the Parquet file rather than reading the entire dataset. The query should report something similar to: `(Run time: 1.43 seconds, Data scanned: 44.38 MB)` along with the results of the query.
