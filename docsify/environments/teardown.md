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

See [the troubleshooting guide](../TROUBLESHOOTING.md) for solutions to problems that may arise during the teardown process.
