#!/bin/bash

# Deletes the source elasticsearch cluster for the environment

# Usage
#   ./delete-elasticsearch-cluster.sh $SOURCE_ELASTICSEARCH

# Arguments
#   - $1 - the cluster to delete

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "$1" ] && echo "The domain to delete must be provided as the \$1 argument." && exit 1

SOURCE_ELASTICSEARCH=$1

was_cluster_deleted=$(aws es delete-elasticsearch-domain --domain "${SOURCE_ELASTICSEARCH}" --region us-east-1 | jq -r ".DomainStatus")

echo "The cluster ${SOURCE_ELASTICSEARCH} was deleted: ${was_cluster_deleted}"
