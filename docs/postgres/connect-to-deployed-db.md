1. Use the [environment switcher](../additional-resources/environment-switcher.md) to point to the deployed environment:
   ```bash
   . scripts/env/set-env.zsh ustc-dev
   ```
1. Run `generate-token.sh` to generate a temporary access token:
   - To generate a read-only token:
      ```bash
      scripts/postgres/generate-token.sh
      ```
   - To generate a read-write token:
      ```bash
      scripts/postgres/generate-token.sh --rw
      ```
1. Connect to the Postgres DB using TablePlus
   1. Populate the host, port, username, password, and database fields using the values from the `generate-token.sh` output
   1. Select "SSL mode preferred"
   1. Select "CA Cert..." and choose the `global-bundle.pem` file in the root of the repo
