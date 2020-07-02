#!/bin/bash -e

# Usage
#   smoketest to verify the private buckets are configured as private

# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, exp1, etc]

[ -z "$1" ] && echo "ERROR: the env to run smoketest to \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1
[ -z "$AWS_PROFILE" ] && [ -z "$AWS_ACCESS_KEY_ID"] && [ -z "$AWS_SECRET_ACCESS_KEY" ] && echo "Error: you must have AWS credentials setup to run this script" && exit 1

ENV=$1

endpoint=$(aws es describe-elasticsearch-domain --domain "efcms-search-$ENV" | jq -r ".DomainStatus.Endpoint" )

response=$(curl -I "https://$endpoint" | head -n 1 | cut -d$' ' -f2)

if [[ "$response" != "403" ]]; then
  echo "ERROR: expected the elasticsearch endpoint of $endpoint to be private"
  exit 1
fi