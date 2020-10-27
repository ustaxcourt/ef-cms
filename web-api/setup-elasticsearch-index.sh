#!/bin/bash -e

# Usage
#   creates the elasticsearch index with configuration

# Requirements
#   - aws cli must be installed on your machine
#   - aws credentials must be setup on your machine
#   - node must be setup on your machine

# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, exp1, etc]

[ -z "$1" ] && echo "The ENV to deploy to must be provided as the \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1
[ -z "${AWS_ACCESS_KEY_ID}" ] && echo "You must have AWS_ACCESS_KEY_ID set in your environment" && exit 1
[ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "You must have AWS_SECRET_ACCESS_KEY set in your environment" && exit 1

ENV=$1

pushd ./web-api/terraform/main
  ../bin/deploy-init.sh "${1}"
  ELASTICSEARCH_ENDPOINT="$(terraform output elasticsearch_endpoint)"	
  ELASTICSEARCH_ENDPOINT_1="$(terraform output elasticsearch_endpoint_1)"
  ELASTICSEARCH_ENDPOINT_2="$(terraform output elasticsearch_endpoint_2)"
  ELASTICSEARCH_ENDPOINT_3="$(terraform output elasticsearch_endpoint_3)"
  ELASTICSEARCH_ENDPOINT_4="$(terraform output elasticsearch_endpoint_4)"
popd

node ./web-api/elasticsearch/elasticsearch-index-settings.js ${ELASTICSEARCH_ENDPOINT}	
node ./web-api/elasticsearch/elasticsearch-index-settings.js ${ELASTICSEARCH_ENDPOINT_1}
node ./web-api/elasticsearch/elasticsearch-index-settings.js ${ELASTICSEARCH_ENDPOINT_2}
node ./web-api/elasticsearch/elasticsearch-index-settings.js ${ELASTICSEARCH_ENDPOINT_3}
node ./web-api/elasticsearch/elasticsearch-index-settings.js ${ELASTICSEARCH_ENDPOINT_4}
