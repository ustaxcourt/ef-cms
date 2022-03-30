#!/bin/bash

# Gets the reindex flag for the environment

# Usage
#   ./get-reindex-flag.sh dev

# Arguments
#   - $1 - the environment to check


( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "$1" ] && echo "The environment to check must be provided as the \$1 argument." && exit 1
[ -z "${USTC_ADMIN_PASS}" ] && echo "You must have USTC_ADMIN_PASS set in your environment" && exit 1
[ -z "${AWS_ACCESS_KEY_ID}" ] && echo "You must have AWS_ACCESS_KEY_ID set in your environment" && exit 1
[ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "You must have AWS_SECRET_ACCESS_KEY set in your environment" && exit 1

ENV=$1

REINDEX_FLAG=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"reindex"},"sk":{"S":"reindex"}}' | jq -r ".Item.current.BOOL")
[ -z "$REINDEX_FLAG" ] && REINDEX_FLAG="false"

echo "${REINDEX_FLAG}"
