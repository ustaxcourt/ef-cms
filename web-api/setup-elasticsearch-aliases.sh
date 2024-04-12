#!/bin/bash

# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, etc]

[ -z "$1" ] && echo "The ENV to deploy to must be provided as the \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1

DESTINATION_DOMAIN=$(./scripts/elasticsearch/get-destination-elasticsearch.sh "${ENV}")
ELASTICSEARCH_ENDPOINT=$(aws es describe-elasticsearch-domain \
  --domain-name "${DESTINATION_DOMAIN}" \
  --region "us-east-1" \
  --query 'DomainStatus.Endpoint' \
  --output text)

npx ts-node --transpile-only ./web-api/elasticsearch/elasticsearch-alias-settings.ts "${ELASTICSEARCH_ENDPOINT}"
