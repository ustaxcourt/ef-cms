#!/bin/bash -e
ENV=$1

if [ $ENV == 'local' ] ; then
  ELASTICSEARCH_ENDPOINT="localhost:9200"
  export ELASTICSEARCH_ENDPOINT
else
  pushd ./web-api/terraform/main
    ../bin/deploy-init.sh "${1}"
    ELASTICSEARCH_ENDPOINT="$(terraform output elasticsearch_endpoint)"
    export ELASTICSEARCH_ENDPOINT
  popd
fi

node ./web-api/check-elasticsearch-mappings.js