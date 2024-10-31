#!/bin/bash

# Generates a temporary auth token for the given environment's RDS cluster

# Usage
#   ENV=dev ./scripts/postgres/generate-token.sh --rw

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

[ "$1" = "--rw" ] && ENDPOINT="Endpoint" || ENDPOINT="ReaderEndpoint"

DESCRIPTION=$(aws rds describe-db-clusters --db-cluster-identifier "${ENV}-dawson-cluster" | jq -r ".DBClusters[0]")
REGION="us-east-1"
DB_HOST=$(jq -r ".${ENDPOINT}" <<< "$DESCRIPTION")
DB_PORT=$(jq -r ".Port" <<< "$DESCRIPTION")
DB_USER="${ENV}_developers"

TOKEN=$(aws rds generate-db-auth-token \
    --hostname "$DB_HOST" \
    --port "$DB_PORT" \
    --region "$REGION" \
    --username "$DB_USER")

if [ -z "$TOKEN" ]; then
    echo "Error: Failed to generate IAM token."
    exit 1
fi

echo "############ Temporary postgres credentials ############"
echo
echo "Host/Socket:"
echo "$DB_HOST"
echo
echo "Port:"
echo "$DB_PORT"
echo
echo "User:"
echo "$DB_USER"
echo
echo "Password:"
echo "$TOKEN"
echo
echo "Database:"
echo "${ENV}_dawson"
echo
