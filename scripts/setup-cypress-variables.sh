#!/bin/bash -e

# Sets up environment variables for Cypress based on Secrets Manager and Dynamo deploy table

# Usage
#   ./scripts/setup-cypress-variables.sh

# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh

export DEPLOYING_COLOR=$(./scripts/dynamo/get-deploying-color.sh "${ENV}")
CURRENT_COLOR=$(./scripts/dynamo/get-current-color.sh "${ENV}")

if [ -n "${1}" ]; then
  export DEPLOYING_COLOR="${CURRENT_COLOR}"
fi
