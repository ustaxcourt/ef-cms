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

export CYPRESS_AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
export CYPRESS_AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
export CYPRESS_AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN
export CYPRESS_DEFAULT_ACCOUNT_PASS=$DEFAULT_ACCOUNT_PASS
export CYPRESS_DEPLOYING_COLOR=$DEPLOYING_COLOR
export CYPRESS_DISABLE_EMAILS=$DISABLE_EMAILS
export CYPRESS_EFCMS_DOMAIN=$EFCMS_DOMAIN
export CYPRESS_ENV=$ENV
export CYPRESS_USTC_ADMIN_PASS=$USTC_ADMIN_PASS
