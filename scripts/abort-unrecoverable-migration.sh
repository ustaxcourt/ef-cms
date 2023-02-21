#!/bin/bash -e

# Run this script after a migration has failed to:
#   - destroy the migration infrastructure
#   - destroy the migration and reindex cron lambdas
#   - delete the destination dynamodb tables
#   - delete the destination elasticsearch cluster

./check-env-variables.sh \
  "ENV" \
  "ZONE_NAME" \
  "EFCMS_DOMAIN" \

MIGRATE_FLAG=$(./scripts/dynamo/get-migrate-flag.sh "$ENV")
SOURCE_TABLE=$(./scripts/dynamo/get-source-table.sh "$ENV")
DESTINATION_TABLE=$(./scripts/dynamo/get-destination-table.sh "$ENV")
export MIGRATE_FLAG="$MIGRATE_FLAG"
export SOURCE_TABLE="$SOURCE_TABLE"
export DESTINATION_TABLE="$DESTINATION_TABLE"

npm run destroy:migration -- "$ENV"
npm run destroy:migration-cron -- "$ENV"
npm run destroy:reindex-cron -- "$ENV"

./setup-for-blue-green-migration.sh --force
