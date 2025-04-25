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