- Manual deploy steps
  - Delete ecr images and containers out of west (since cannot delete ECR without it being empty)
  

- Jim Questions:
  - Should we keep or remove the health check and associated alarm for the east?
  - Do we ever pass 'region' into glue-cron-applyables, migration-applayble, migration-cron-applyable, reindex-cron-applyables,stale-cases-email-cron-applyable, switch-colors-cron-applyable, wait-for-workflow-cron-applyable?
  - can we delete web-api/ban-ip-address.sh?

- Plan
  - first PR/deploy: only update blue/green
  - second PR/deploy: the rest (account-specific, allColors, etc.)

- east-west issues -- gone if we delete west

- Deleting west
  - blue/green: only affect the respective colors, so should be fine to modify for the passive color
  - allColors deploy: affects both active and passive, so be careful
  - account-specific deploy: affects both active and passive, so be careful
  - make sure routing is correct (don't route to west!)
  - health checks (no need for them if not routing conditionally)
  - Do we need getDBReader vs getDbWriter? Still need to do Opensearch sync
    - if not much overhead, refactor some connection stuff (e.g., no need to have a callback to make a connection)
  - establishing a DB connection at a good time
  - Things that should stay in the west
    - backup documents bucket
    - replicated database? (Awaiting Jim)

Cannot be done in first deploy. Wait until after first deploy:

account-specific:
  module "default_vpc_west" {
    source = "../../modules/default-vpc"
    providers = {
      aws = aws.us-west-1
    }
  }

allColors:
  - all us-west-1