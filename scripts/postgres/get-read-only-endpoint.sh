#!/bin/bash

# Returns the read-only endpoint for a given environment's RDS cluster

# Parameters
#   --yes    Presumes prior confirmation when checking environment variables

# Usage
#   ENV=dev ./scripts/postgres/get-read-only-endpoint.sh --yes

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1

# shellcheck disable=SC1091
source "./scripts/helpers/prior-confirmation.sh"

confirmed=$(has_prior_confirmation "$@")
{ [[ "$confirmed" -eq 1 ]] || [[ -n "$CI" ]]; } && QUIET="--quiet"

./check-env-variables.sh "$QUIET" \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

aws rds describe-db-clusters --db-cluster-identifier "${ENV}-dawson-cluster" | jq -r ".DBClusters[0].ReaderEndpoint"
