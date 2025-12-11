#!/bin/bash -e

# Sets up environment variables for Cypress based on SSM parameters

# Usage
#   ./scripts/setup-cypress-variables.sh

# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh

DEPLOYING_COLOR=$(./scripts/ssm/get-deploying-color.sh "${ENV}")
export DEPLOYING_COLOR

CURRENT_COLOR=$(./scripts/ssm/get-current-color.sh "${ENV}")
export CURRENT_COLOR
