# Backing up Elasticsearch

To help save money on the flexion side, we wrote scripts to backup an elasticsearch domain into an s3 bucket and scripts for restoring those domains from the s3 bucket.  We followed this document https://aws.amazon.com/blogs/database/use-amazon-s3-to-store-a-single-amazon-elasticsearch-service-index/ to get this working, so it covers most of everything, but pasted below are some examples of how we got it done with curl commands:

Bucket: arn:aws:s3:::es-snapshots-flexion.us
Policy: es-snapshots-flexion
Role: es-snapshots-flexion.us
> aws iam create-role --role-name es-snapshots-flexion.us --assume-role-policy-document \
 '{
   "Version":"2012-10-17",
   "Statement":[
      {
         "Sid":"",
         "Effect":"Allow",
         "Principal":{
            "Service":"es.amazonaws.com"
         },
         "Action":"sts:AssumeRole"
      }
   ]
}'
OUTPUT:
{
    "Role": {
        "AssumeRolePolicyDocument": {
            "Version": "2012-10-17", 
            "Statement": [
                {
                    "Action": "sts:AssumeRole", 
                    "Principal": {
                        "Service": "es.amazonaws.com"
                    }, 
                    "Effect": "Allow", 
                    "Sid": ""
                }
            ]
        }, 
        "RoleId": "AROAXQCLQG6GXWDMIYKJT", 
        "CreateDate": "2020-12-11T17:05:28Z", 
        "RoleName": "es-snapshots-flexion.us", 
        "Path": "/", 
        "Arn": "arn:aws:iam::ACCOUNT_ID:role/es-snapshots-flexion.us"
    }
}
Must then ATTACH the newly-created policy to the role above using IAM console.
--------
> brew install aws-es-proxy
Start aws-es-proxy:
> aws-es-proxy -endpoint https://search-efcms-search-exp1-alpha-mfw3vraot22mobs7qpqpcb5tvm.us-east-1.es.amazonaws.com/
Repository name is: snapshot-repository
Likely command:
> curl -XPUT 'http://localhost:9200/_snapshot/snapshot-repository' -H "Content-Type: application/json" -d'{
    "type": "s3",
    "settings": {
        "bucket": "es-snapshots-flexion.us",
        "region": "us-east-1",
        "role_arn": "arn:aws:iam::ACCOUNT_ID:role/es-snapshots-flexion.us"
    }
}' 
OUTPUT:
{"acknowledged":true}
BACK UP AN INDEX:
> curl -XPUT 'http://localhost:9200/_snapshot/snapshot-repository/snapshot_1' -H "Content-Type: application/json" -d'{
  "indices": ["efcms-work-item", "efcms-user", "efcms-case", "efcms-user-case", "efcms-docket-entry", "efcms-case-deadline", "efcms-message"],
  "ignore_unavailable": true,
  "include_global_state": false
}'
OUTPUT:
{"accepted":true}
Check status of snapshot backup / progress (?): 
> curl -XGET localhost:9200/_snapshot/snapshot-repository/_status
OUTPUT: {"snapshots":[]}
> curl -XGET localhost:9200/_snapshot/snapshot-repository/_all
OUTPUT:
{
   "snapshots":[
      {
         "snapshot":"snapshot_1",
         "uuid":"j2rgQ5rURwOSN31xqSbUtw",
         "version_id":7040299,
         "version":"7.4.2",
         "indices":[
            "efcms-case-deadline",
            "efcms-docket-entry",
            "efcms-work-item",
            "efcms-case",
            "efcms-message",
            "efcms-user",
            "efcms-user-case"
         ],
         "include_global_state":false,
         "state":"SUCCESS",
         "start_time":"2020-12-11T17:46:23.305Z",
         "start_time_in_millis":1607708783305,
         "end_time":"2020-12-11T17:46:27.711Z",
         "end_time_in_millis":1607708787711,
         "duration_in_millis":4406,
         "failures":[
            
         ],
         "shards":{
            "total":7,
            "failed":0,
            "successful":7
         }
      }
   ]
}
Clear elasticsearch:
> ELASTICSEARCH_ENDPOINT=https://search-efcms-search-exp1-alpha-mfw3vraot22mobs7qpqpcb5tvm.us-east-1.es.amazonaws.com/ \
 node ./web-api/delete-elasticsearch-index.js
Or, delete an entire domain:
experimental domain name: snapshot-test-domain
Then restore a domain:
Restore indices to the same cluster:
> curl -XPOST 'http://localhost:9200/_snapshot/snapshot-repository/snapshot_1/_restore' -H "Content-Type: application/json" -d'{
  "indices": ["efcms-work-item", "efcms-user", "efcms-case", "efcms-user-case", "efcms-docket-entry", "efcms-case-deadline", "efcms-message"],
  "ignore_unavailable": false,
  "include_global_state": false
}'
OUTPUT: {"accepted":true}
