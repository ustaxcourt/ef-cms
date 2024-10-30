#!/bin/bash

# Returns the read-write endpoint for a given environment's RDS cluster

# Usage
#   ENV=dev ./scripts/postgres/get-read-write-endpoint.sh

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws rds describe-db-clusters --db-cluster-identifier "${ENV}-dawson-cluster" | jq -r ".DBClusters[0].Endpoint"
