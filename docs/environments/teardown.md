# Environment teardown

This document covers what to do when an environment is no longer needed and should be removed.

## Process

To remove an environment, make sure your local development environment is configured as you would need to [setup an environment](./setup.md), ensuring that you are targeting the desired environment.

```bash
npm run destroy:[ENV]
```

If the script is not available to destroy the named environment you need, look at `package.json` and determine the appropriate command to run.

## Known issues

- When an S3 bucket has more than 1000 items, the delete script will fail to remove it as it will not be emptied before the delete command is run.

- The teardown scripts match environment names using a regular expression which may match resources in other environments.
