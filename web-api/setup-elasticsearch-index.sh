#!/bin/bash -e
ENV=$1

pushd ./web-api/terraform/main
  ../bin/deploy-init.sh "${1}"
  ELASTICSEARCH_ENDPOINT="$(terraform output elasticsearch_endpoint)"
  export ELASTICSEARCH_ENDPOINT
popd

node ./web-api/elasticsearch-index-settings.js