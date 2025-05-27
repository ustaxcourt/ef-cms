TODO
- Maybe make west delete scripts fail
- delete smircleCi

Finished
- account specific
- all-colors
- green/blue

- Jim Questions:
  - Should we keep or remove the health check and associated alarm for the east? We can remove the health check, cloudwatch alarm, and the custom health check interactors.
  - Do we ever pass 'region' into glue-cron-applyables, migration-applayble, migration-cron-applyable, reindex-cron-applyables,stale-cases-email-cron-applyable, switch-colors-cron-applyable, wait-for-workflow-cron-applyable?
  - can we delete web-api/ban-ip-address.sh?
  - Are we keeping the replica in west? No
  - "Do you want this ui health check that does nothing?": /modules/ui-healthcheck
  - can we switch from dynamodb_table to [use_lockfile](https://developer.hashicorp.com/terraform/language/backend/s3#use_lockfile)