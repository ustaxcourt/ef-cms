# Environment teardown

This document covers what to do when an environment is no longer needed and should be removed.

## Process

To remove an environment, make sure your local development environment is configured as you would need to [setup an environment](./setup.md), ensuring that you are targeting the desired environment.

```bash
npm run destroy:env <ENV>
npm run destroy:api <ENV>
npm run destroy:client <ENV>
npm run destroy:migration <ENV>
npm run destroy:migration-cron <ENV>
```

The cognito user pools have `lifecycle.prevent_destroy` set to true, so you have to manually delete them via the AWS console. You will have to delete both `efcms-<ENV>` and `efcms-irs-<ENV>` pools.
  - Go to Cognito
  - Select the user pool 
  - Click on App Integration > Domain Name
  - Click 'Delete Domain'
  - Go back to 'General Settings' for the cognito pool 
  - Click 'Delete Pool'

## Known issues

- The teardown scripts match environment names using a regular expression which may match resources in other environments.