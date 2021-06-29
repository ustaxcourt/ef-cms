# Elasticsearch Snapshots

Parsing log entries into an Elasticsearch creates individual indices for each day. These indices require significant space and become less useful as they age. In order to save space while still maintain log records for future use, we can save these indexes as snapshots in an S3 bucket.

This requires:
- An S3 bucket
- A IAM role as [described in the documentation](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-managedomains-snapshots.html) with permissions to read/write into the bucket

With these requirements, and snapshot repository can be created in the Elasticsearch cluster using Kibana by passing the bucket and role ARN into the `_snapshot` endpoint:

```
PUT /_snapshot/archived-logs
{
    "type" : "s3",
    "settings" : {
      "bucket" : "ustc-log-snapshots",
      "region" : "us-east-1",
      "role_arn" : "arn:aws:iam::111112222333:role/es-s3-snapshot-access"
    }
}
```

`archived-logs` will be the name of the repository and used in future calls to add or restore snapshots. 

## Adding an index to the snapshot repository

```
PUT /_snapshot/archived-logs/cwl-2021.01.31
{
  "indices": "cwl-2021.01.31",
  "ignore_unavailable": true,
  "include_global_state": false,
  "metadata": {
    "taken_by": "Me",
    "taken_because": "Backup old indices before cleaning up"
  }
}
```

Note: the original index is the value passed into `indices:` the name of the snapshot will be the last segment of the URL. The name is what will be displayed when listing the snapshots. These are the same for convenience, but don't need to be. 

## Listing Snapshots
```
GET /_cat/snapshots/archived-logs
```

## Restoring a Snapshot
```
POST /_snapshot/archived-logs/cwl-2020.11.12/_restore
```

Where `cwl-2020.11.12` is the name of the snapshot displayed in the snapshot list.

## AWS Automatic Snapshots
AWS creates snapshots of all indices in a cluster. This snapshot is made periodically and intended to restoring the cluster on failure. The data in this snapshot is only maintained for 14 days, so it is not suitable for long-term archiving.