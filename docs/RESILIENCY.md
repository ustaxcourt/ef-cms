* We use AWS to alert regarding failures
* Accepted risk: Cognito failure brings app down
* Accepted risk: Logs in the same availability zone as dependencies - if zone is unavailable, can't rely on log-based alerts
* Automated system status notifications on the application? (health check page could be involved, or something else)
* Alarms/Notification Questions:
  * Elasticsearch health alarm(s)?
  * DynamoDB health alarm(s)?
  * S3 app/documents objects availability alarms?
  * SES alerts - bounced emails etc. (check with Mike about whether this is set up to be sent to one of his tax court emails already)
  * etc

* Audit logs for AWS system-level changes (like an S3 bucket getting deleted, for instance)
* Alerts for AWS system-level changes that are high-risk / indicate bad actors
* UIs are unavailable if the app S3 buckets are down/deleted. Failover is set up for us-east-1 -> us-west-1 for S3.
* Versioning is properly configured for S3 - but that won't guarantee zero loss of documents objects, since objects can still be perma-deleted.
* General disaster recovery issue needs to be logged - if AWS regions are down completely what do we do and how do we communicate with users?
  * Should we back up all the things on-prem? (Mike has this risk documented)

TODO: add checklist to failover epic to keep track of what system components have it set up
