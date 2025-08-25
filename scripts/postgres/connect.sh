#!/bin/bash -e

# Generates a temporary auth token for the given environment's RDS cluster and initiates a connection with psql

# Parameters
#   --rw              Connects to the cluster's writeable endpoint
#   --yes             Presumes prior confirmation when checking environment variables
#   --file=file.sql   Passes the provided file path into psql with -f

# Usage examples
#   ./scripts/postgres/connect.sh --yes
#   DB_USER="${ENV}_dawson" ./scripts/postgres/connect.sh --rw --file=./scripts/postgres/backup.sql

( ! command -v psql > /dev/null ) && echo "psql must be installed on your machine." && exit 1

CHECK_ENV_PARAMS=("ENV" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY")
GENERATE_TOKEN_PARAMS=("--quiet")

for param in "$@"; do
  { [[ "$param" == "--rw" ]] || [[ "$param" == "-w" ]]; } && GENERATE_TOKEN_PARAMS+=("--rw")
  { [[ "$param" == "--yes" ]] || [[ "$param" == "-y" ]]; } && CHECK_ENV_PARAMS+=("--yes")
  { [[ "$param" =~ ^--file= ]] || [[ "$param" =~ ^-f= ]]; } && SQL_FILE="${param#*=}"
done

[[ -n "$SQL_FILE" ]] && [[ ! $(readlink -f "$SQL_FILE") ]] && echo "Invalid file path: ${SQL_FILE}" && exit 1
./check-env-variables.sh "${CHECK_ENV_PARAMS[@]}"

[[ -n "$DB_TOKEN" ]] && unset "DB_TOKEN"
# shellcheck disable=SC1091
source "./scripts/postgres/generate-token.sh" "${GENERATE_TOKEN_PARAMS[@]}"

{
  [[ -z "$DB_HOST" ]] ||
  [[ -z "$DB_USER" ]] ||
  [[ -z "$DB_TOKEN" ]] ||
  [[ -z "$DB_NAME" ]];
} && echo "Unable to generate IAM token" && exit 1

PSQL_PARAMS=("-h" "$DB_HOST" "-U" "$DB_USER" "-d" "$DB_NAME")
[[ -n "$SQL_FILE" ]] && PSQL_PARAMS+=("-f" "$SQL_FILE")

echo "psql" "${PSQL_PARAMS[@]}"
PGPASSWORD="$DB_TOKEN" psql "${PSQL_PARAMS[@]}"
