#!/bin/bash -e

# Creates all missing feature flag items in the dynamo deploy table

# Usage
#   ./scripts/setup-cypress-variables.sh

#if [ -z "${ENV}" ]; then
#  ENV=$1
#fi

# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh

export DEPLOYING_COLOR=$(./scripts/dynamo/get-deploying-color.sh "${ENV}")
CURRENT_COLOR=$(./scripts/dynamo/get-current-color.sh "${ENV}")

if [ -n "${1}" ]; then
  export DEPLOYING_COLOR="${CURRENT_COLOR}"
fi

export AWS_ACCESS_KEY_ID="${CIRCLE_AWS_ACCESS_KEY_ID}"
export AWS_ACCOUNT_ID="${CIRCLE_AWS_ACCOUNT_ID}"
export AWS_SECRET_ACCESS_KEY="${CIRCLE_AWS_SECRET_ACCESS_KEY}"
