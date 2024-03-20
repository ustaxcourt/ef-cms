#!/bin/bash -e

# Usage
#   creates the elasticsearch index with configuration

# Requirements
#   - aws cli must be installed on your machine
#   - aws credentials must be setup on your machine
#   - node must be setup on your machine

# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, etc]

( ! command -v aws > /dev/null ) && echo "aws was not found on your path. Please install aws." && exit 1
( ! command -v node > /dev/null ) && echo "node was not found on your path. Please install node." && exit 1

[ -z "$1" ] && echo "The ENV to deploy to must be provided as the \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1
[ -z "${AWS_ACCESS_KEY_ID}" ] && echo "You must have AWS_ACCESS_KEY_ID set in your environment" && exit 1
[ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "You must have AWS_SECRET_ACCESS_KEY set in your environment" && exit 1

ENV=$1

DESTINATION_DOMAIN=$(./scripts/elasticsearch/get-destination-elasticsearch.sh "${ENV}")

if [[ "${DESTINATION_DOMAIN}" == *'alpha'* ]]; then
  ELASTICSEARCH_ENDPOINT=aws ssm get-parameter \
    --name "terraform-${ENV}-elasticsearch-endpoint-alpha" \
    --with-decryption | jq -r ".Parameter.Value"
else
  ELASTICSEARCH_ENDPOINT=aws ssm get-parameter \
    --name "terraform-${ENV}-elasticsearch-endpoint-beta" \
    --with-decryption | jq -r ".Parameter.Value"
fi

echo "- DESTINATION_DOMAIN: ${DESTINATION_DOMAIN}"

if [[ -n "${ELASTICSEARCH_ENDPOINT}" ]]; then
  echo " => Setting up ${DESTINATION_DOMAIN} Cluster"
  npx ts-node --transpile-only ./web-api/elasticsearch/elasticsearch-index-settings.ts "${ELASTICSEARCH_ENDPOINT}"
else 
  echo "!!! Did not calculate an ELASTICSEARCH_ENDPOINT"
  exit 1;
fi
