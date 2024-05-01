## TO DO
- Update documentation around anything having to do with workflow-terraform/ directory
- Add blue green migrations for UI
- Create PR with environment-specific folder deleted so it can be merged after we delete all the environment-specific resources.

## Deployment Steps:
- Run an account specific deploy.
- Kick off a CircleCI build.
- Run an environment specific deploy (this will destroy all deprecated environment specific resources that are now deployed as part of the API deploy step).