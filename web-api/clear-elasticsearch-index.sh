#!/bin/bash -e

#
# This script is script part of the clear-env.sh script.  It is used for deleting the elasticsearch index
# so that data can be reseeded if needed.

# Requirements
#   - terraform must be installed on your machine
#   - node must be installed on your machine
#   - AWS credentials must be setup on your machine
#
# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, etc]
#   - $2 - the elasticsearch endpoint to clear

[ -z "${AWS_ACCESS_KEY_ID}" ] && echo "You must have AWS_ACCESS_KEY_ID set in your environment" && exit 1
[ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "You must have AWS_SECRET_ACCESS_KEY set in your environment" && exit 1
[ -z "${ELASTICSEARCH_ENDPOINT}" ] && echo "You must have ELASTICSEARCH_ENDPOINT set in your environment" && exit 1

npx ts-node --transpile-only ./web-api/delete-elasticsearch-index.js
