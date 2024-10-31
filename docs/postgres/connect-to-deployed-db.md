# Connecting to a Deployed Postgres Database from TablePlus

Note: all commands should be run from the root of the `ef-cms` directory.

### Creating a new connection in TablePlus

1. Use the [environment switcher](../additional-resources/environment-switcher.md) to point to the deployed environment:
   ```bash
   . scripts/env/set-env.zsh ustc-dev
   ```
1. Run `generate-token.sh` to determine the connection details and generate a temporary access token:
   - To generate a token for the read-only endpoint:
      ```bash
      scripts/postgres/generate-token.sh
      ```
   - To generate a token for the writeable endpoint:
      ```bash
      scripts/postgres/generate-token.sh --rw
      ```
1. Add a new connection in TablePlus:
   1. Populate the host, port, username, password, and database fields using the values from the `generate-token.sh` output from step 2
   1. Select "SSL mode preferred"
   1. Select "CA Cert..." and choose the `global-bundle.pem` file in the root of the repo

### (Optional) Configure an existing connection to automatically retrieve new tokens:

1. Determine the exact full path to the `get-token-for-tableplus.zsh` script:
   ```bash
   readlink -f scripts/postgres/get-token-for-tableplus.zsh
   ```
1. Determine which arguments to pass in:
   1. The first argument is the environment string that you pass into the environment switcher when switching to the deployed environment (eg. `ustc-dev`)
   1. If this connection is to the writeable endpoint, you will also need to pass in the `--rw` flag
1. Edit the connection in TablePlus:
   1. Clear out the value in the password field
   1. Select "Command Line" in the dropdown next to the password field
   1. Populate the password field with the exact full path to the `get-token-for-tableplus.zsh` script and include the parameters you determined:
      ```bash
      /path/to/get-token-for-tableplus.zsh ustc-dev --rw
      ```
