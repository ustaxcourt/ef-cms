#!/bin/bash

# Generates a temporary auth token for the given environment's RDS cluster

# Usage
#   ENV=dev ./scripts/postgres/generate-token.sh --rw

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

[ "$1" = "--rw" ] && ENDPOINT="Endpoint" || ENDPOINT="ReaderEndpoint"

CLUSTER_DESCRIPTION=$(aws rds describe-db-clusters --db-cluster-identifier "${ENV}-dawson-cluster" | jq -r ".DBClusters[0]")

# Set variables
REGION="us-east-1"
DB_HOST=$(jq -r ".${ENDPOINT}" <<< "$CLUSTER_DESCRIPTION")
DB_PORT=$(jq -r ".Port" <<< "$CLUSTER_DESCRIPTION")
DB_USER="${ENV}_developers"

# Generate the IAM authentication token
TOKEN=$(aws rds generate-db-auth-token \
    --hostname "$DB_HOST" \
    --port "$DB_PORT" \
    --region "$REGION" \
    --username "$DB_USER")

# Check if the token was generated successfully
if [ -z "$TOKEN" ]; then
    echo "Error: Failed to generate IAM token."
    exit 1
fi

# Output the generated token (optional)
echo "Generated IAM Token:"
echo "$TOKEN"
