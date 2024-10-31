#!/bin/bash -e

# Generates a temporary auth token for the given environment's RDS cluster

# Usage
#   ENV=dev ./scripts/postgres/generate-token.sh --rw

# shellcheck disable=SC1091
source "./scripts/helpers/suppress-output.sh"

{
  [[ -n $ZSH_VERSION && $ZSH_EVAL_CONTEXT =~ :file$ ]] ||
  [[ -n $BASH_VERSION ]] && (return 0 2>/dev/null);
} && sourced=1 || sourced=0
[[ $sourced -eq 0 ]] && exit="exit" || exit="return"

sshhh=$(should_suppress_output "$@")
[[ "$sshhh" -eq 1 ]] && QUIET="--quiet"

./check-env-variables.sh "$QUIET" \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

for param in "$@"; do
  if [[ "$param" == "--rw" ]]; then
    RW=1
  fi
done
[[ "$RW" -eq 1 ]] && ENDPOINT="Endpoint" || ENDPOINT="ReaderEndpoint"

DESCRIPTION=$(aws rds describe-db-clusters --db-cluster-identifier "${ENV}-dawson-cluster" | jq -r ".DBClusters[0]")
REGION="us-east-1"
DB_HOST=$(jq -r ".${ENDPOINT}" <<< "$DESCRIPTION")
DB_PORT=$(jq -r ".Port" <<< "$DESCRIPTION")
DB_USER="${ENV}_developers"
DB_NAME="${ENV}_dawson"

TOKEN=$(aws rds generate-db-auth-token \
    --hostname "$DB_HOST" \
    --port "$DB_PORT" \
    --region "$REGION" \
    --username "$DB_USER")

if [[ -z "$TOKEN" ]]; then
    [[ "$sshhh" -eq 0 ]] && echo -e "\nError: Failed to generate IAM token."
    $exit 1
fi

if [[ "$sshhh" -eq 0 ]]; then
  echo -e "\n"
  echo -e "############ Temporary postgres credentials ############\n"
  echo "Host/Socket:"
  echo -e "${DB_HOST}\n"
  echo "Port:"
  echo -e "${DB_PORT}\n"
  echo "User:"
  echo -e "${DB_USER}\n"
  echo "Password:"
  echo -e "${TOKEN}\n"
  echo "Database:"
  echo -e "${DB_NAME}\n"
else
  export DB_HOST="$DB_HOST"
  export DB_PORT="$DB_PORT"
  export DB_USER="$DB_USER"
  export DB_TOKEN="$TOKEN"
  export DB_NAME="$DB_NAME"
fi
