# Environment teardown

This document covers what to do when an environment is no longer needed and should be removed.

## Process

To remove an environment, make sure your local development environment is configured as you would need to [setup an environment](./setup.md), ensuring that you are targeting the desired environment.

```bash
npm run destroy:env <ENV>
npm run destroy:api -- <ENV>
npm run destroy:client -- <ENV>
npm run destroy:migration -- <ENV>
npm run destroy:migration-cron -- <ENV>
```

## Known Issues

- Unable to delete the cognito user pool.
  - Cause: The cognito user pools have `lifecycle.prevent_destroy` set to true, so you have to manually delete them via the AWS console. You will have to delete both `efcms-<ENV>` and `efcms-irs-<ENV>` pools.
  - Solution: 
    - Go to Cognito
    - Select "Manage User Pools"
    - Select the user pool 
    - Click on App Integration > Domain Name
    - Click 'Delete Domain'
    - Go back to 'General Settings' for the cognito pool 
    - Click 'Delete Pool'

- Error archiving file /template/lambdas/dist/<some-file.js>
  - Cause: Files built by webpack during the deploy are not available
  - Solution: Run the web-api webpack build to bundle the files into the expected folder
    ```bash
    npm run build:lambda:api
    ```
- Error deleting Lambda@Edge function
  - Cause: Replicas are still deleting
  - Solution: Wait 20ish minutes and then try again