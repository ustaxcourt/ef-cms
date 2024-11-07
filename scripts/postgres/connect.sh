#!/bin/bash -e

# Generates a temporary auth token for the given environment's RDS cluster and initiates a connection with psql

# Parameters
#   --rw    Connects to the cluster's writeable endpoint

# Usage examples
#   ENV=dev ./scripts/postgres/connect.sh
#   ENV=dev ./scripts/postgres/connect.sh --rw

( ! command -v psql > /dev/null ) && echo "psql must be installed on your machine." && exit 1

for param in "$@"; do
  if [[ "$param" == "--rw" ]]; then
    RW="--rw"
  fi
done

source "./scripts/postgres/generate-token.sh" "$RW" --quiet

{
  [[ -z "$DB_HOST" ]] ||
  [[ -z "$DB_USER" ]] ||
  [[ -z "$DB_TOKEN" ]] ||
  [[ -z "$DB_NAME" ]];
} && echo "Unable to generate IAM token" && exit 1

PGPASSWORD="$DB_TOKEN" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME"
