#!/bin/bash

# Returns the read-write endpoint for a given environment's RDS cluster

# Parameters
#   --yes    Presumes prior confirmation when checking environment variables

# Usage
#   ENV=dev ./scripts/postgres/get-read-write-endpoint.sh --yes

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1

# shellcheck disable=SC1091
source "./scripts/helpers/prior-confirmation.sh"

CHECK_PARAMS=("ENV" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY")

confirmed=$(has_prior_confirmation "$@")
{ [[ "$confirmed" -eq 1 ]] || [[ -n "$CI" ]]; } && CHECK_PARAMS+=("--quiet")

./check-env-variables.sh "${CHECK_PARAMS[@]}"

aws rds describe-db-clusters --db-cluster-identifier "${ENV}-dawson-cluster" | jq -r ".DBClusters[0].Endpoint"
