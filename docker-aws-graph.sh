#!/bin/bash -e
docker build -t aws-graph -f Dockerfile.aws-graph .
set +e
docker run --name aws-graph aws-graph
CODE="$?"
set -e
docker cp "aws-graph:/home/app/aws.json" aws.json
docker rm "aws-graph"
exit "${CODE}"