#!/bin/bash -e

pushd ./web-api/terraform/main
  ../bin/deploy-init.sh "${1}"
  export DYNAMO_STREAM_ARN=$(terraform output dynamo_stream_arn)
  export ELASTICSEARCH_ENDPOINT=$(terraform output elasticsearch_endpoint)
popd

./web-api/run-serverless.sh "${1}" "${2}" "streamsHandlers.js" "serverless-streams.yml" "build:api:streams"
