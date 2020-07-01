#!/bin/bash

# Usage
#   smoketest to verify that the authorizer is working on the api

# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, exp1, etc]

[ -z "$1" ] && echo "The env to run smoketest to \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1

ENV=$1

response=$(curl -I "https://efcms-api-${ENV}.${EFCMS_DOMAIN}/api/swagger" | head -n 1 | cut -d$' ' -f2)

if [[ "$response" != "403" ]]; then
  echo "expected endpoint to throw Unauthorized error with invalid token"
  exit 1
fi

response=$(curl -I "https://efcms-api-${ENV}.${EFCMS_DOMAIN}/cases/open" \
  -H "Authorization: b" | head -n 1 | cut -d$' ' -f2
)

if [[ "$response" != "403" ]]; then
  echo "expected endpoint to throw Unauthorized error with invalid token"
  exit 1
fi
