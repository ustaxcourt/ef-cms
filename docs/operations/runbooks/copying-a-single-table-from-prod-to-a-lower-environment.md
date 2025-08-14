# Copying a Single Table from Prod to a Lower Environment

## Description

This runbook describes the process of restoring a single postgres table from production to a lower environment, either by overwriting the contents of a table with the same name or by creating a new table, in the lower environment.

## Preqrequisites

- This runbook can only be executed if the target lower environment is already a "prodlike" lower environment:
   - it has already been defined in the production account's `PRODLIKE_LOWER_ENV_ACCOUNT_IDS` secret
   - it already has a `restore_role` which grants the production account the ability to write to its database

## Steps

1. Use the environment switcher to switch to the production account:
   ```bash
   . scripts/set-env.zsh prod
   ```
1. Export the `TARGET_ACCOUNT_ID` and `TARGET_ENV` environment variables:
   ```bash
   export TARGET_ACCOUNT_ID="1234567890"
   export TARGET_ENV="myenv"
   ```
1. Export the name of the database table in production that will serve as the source table:
   ```bash
   export SOURCE_POSTGRES_TABLE_NAME="dw_work_item"
   ```
1. Export the name of the table in the lower environment that will be the target of this data import:
   ```bash
   export TARGET_POSTGRES_TABLE_NAME="dw_work_item_prod"
   ```
1. Perform the data import:
   ```bash
   scripts/postgres/restoreTableFromSource.ts $SOURCE_POSTGRES_TABLE_NAME $TARGET_POSTGRES_TABLE_NAME
   ```
1. If the target table name was not the same as the source table name, you will need to grant the `<ENV>_dawson` user access to the newly created table:
   ```bash
   . scripts/env/set-env.zsh <target-env>
   cd ./scripts/postgres && ./create-rds-users.sh && cd ../..
   ```
