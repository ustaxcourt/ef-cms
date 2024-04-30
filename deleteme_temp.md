- Move files from scripts/dynamo to scripts/migration
- Update documentation around anything having to do with workflow-terraform/ directory
- Add blue green migrations for UI
- Delete environment specific terraform.

## Deployment Steps:
- Run an account specific deploy.
- Kick off a CircleCI build.
- Run an environment specific deploy (this will destroy all deprecated environment specific resources that are now deployed as part of the API deploy step).