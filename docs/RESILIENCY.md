* Accepted risk: We use AWS to alert regarding failures
* Accepted risk: Cognito failure brings app down
* Accepted risk: Logs in the same availability zone as dependencies - if zone is unavailable, can't rely on log-based alerts
* Automated system status notifications on the application? (health check page could be involved, or something else) - SNS (follow up with Andrew and Mike about what is covered right now)
* Alarms/Notification Questions:
  * Elasticsearch health alarm(s)? (CPU Spikes, JVM memory pressure, etc.)
  * DynamoDB health alarm(s)?
  * S3 app/documents objects availability alarms? UIs are unavailable if the app S3 buckets are down/deleted. Failover is set up for us-east-1 -> us-west-1 for S3. - Check if set up
  * SES alerts - bounced emails etc. (check with Mike about whether this is set up to be sent to one of his tax court emails already)  - [Check if alerting/monitoring set up for high bounce rates]
  * etc

* Audit logs for AWS system-level changes (like an S3 bucket getting deleted, for instance) - CloudTrail should cover this
* Alerts for AWS system-level changes that are high-risk / indicate bad actors - CloudTrail events Cloudwatch alarms - log issue if hasn't been created

* Accepted Risk: Versioning is properly configured for S3 - but that won't guarantee zero loss of documents objects, since objects can still be perma-deleted. - Permissions could be locked down? 
* Accepted Risk: General disaster recovery issue needs to be logged - if AWS regions are down completely what do we do and how do we communicate with users?
  * Should we back up all the things on-prem? - Should log an issue (link an issue from ATO repo to an issue in ef-cms repo)

TODO: add checklist to failover epic to keep track of what system components have it set up
