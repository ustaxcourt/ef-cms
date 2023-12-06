#!/bin/bash -e

# Usage
#   smoketest to verify the ElasticSearch domains are configured as private

# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, etc]

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "${1}" ] && echo "ERROR: the env to run smoketest to \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1
[ -z "${AWS_PROFILE}" ] && [ -z "${AWS_ACCESS_KEY_ID}" ] && [ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "Error: you must have AWS credentials setup to run this script" && exit 1

ENV="${1}"

MIGRATE_FLAG=$(./scripts/dynamo/get-migrate-flag.sh "${ENV}")
DESTINATION_DOMAIN=$(./scripts/elasticsearch/get-destination-elasticsearch.sh "${ENV}")

function check_es_exists() {
  environment="${1}"
  version="${2}"

  endpoint=$(aws es describe-elasticsearch-domain --domain "efcms-search-${environment}-${version}" --region us-east-1 | jq -r ".DomainStatus.Endpoint" )

  response=$(curl -I "https://${endpoint}" | head -n 1 | cut -d$' ' -f2)

  if [[ "$response" != "403" ]]; then
    echo "ERROR: expected the elasticsearch endpoint of ${endpoint} to be private"
    exit 1
  fi
}

if [ "${MIGRATE_FLAG}" == 'false' ]; then
  if [[ "${DESTINATION_DOMAIN}" == *'alpha'* ]]; then
    check_es_exists "${ENV}" "alpha"
  else
    check_es_exists "${ENV}" "beta"
  fi
else
  check_es_exists "${ENV}" "alpha"

  check_es_exists "${ENV}" "beta"
fi
