#!/bin/bash -e

pushd ./web-api/terraform/main
  ../bin/deploy-init.sh "${1}"
  DYNAMO_STREAM_ARN="$(terraform output dynamo_stream_arn)"
  ELASTICSEARCH_ENDPOINT="$(terraform output elasticsearch_endpoint)"
  export DYNAMO_STREAM_ARN ELASTICSEARCH_ENDPOINT
popd

./web-api/run-serverless.sh "${1}" "${2}" "streamsHandlers.js" "serverless-streams.yml" "build:api:streams"
