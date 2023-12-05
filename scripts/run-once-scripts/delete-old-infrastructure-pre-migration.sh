#!/bin/bash

# this script can be used when forcing a migration
# where the cleanup CircleCI job hasn't run
# but you don't want to manually delete the destination cluster and tables

# Usage
#   ./delete-old-infrastructure-pre-migration exp1

# Arguments
#   - $1 - the environment to delete the destination dynamo and opensearch cluster

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "$1" ] && echo "The env to check must be provided as the \$1 argument." && exit 1

ENV=$1

DESTINATION_OPENSEARCH_CLUSTER=$(./scripts/elasticsearch/get-destination-elasticsearch.sh "$ENV")
export DESTINATION_OPENSEARCH_CLUSTER
echo "deleting destination opensearch cluster: $DESTINATION_OPENSEARCH_CLUSTER"
./scripts/elasticsearch/delete-elasticsearch-cluster.sh "${DESTINATION_OPENSEARCH_CLUSTER}"

DESTINATION_TABLE=$(./scripts/dynamo/get-destination-table.sh "$ENV")
export DESTINATION_TABLE
echo "deleting destination dynamo table in both regions: $DESTINATION_TABLE"
./scripts/dynamo/delete-dynamo-table.sh "${DESTINATION_TABLE}"
