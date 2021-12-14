#!/bin/bash

# Sets up the s3 lambda bucket with blue and green files for maintenance-notify code

# Usage
#   ./setup-s3-maintenance-file.sh dev

# Arguments
#   - $1 - the environment to check

[ -z "$1" ] && echo "The environment to check must be provided as the \$1 argument." && exit 1
[ -z "${AWS_ACCESS_KEY_ID}" ] && echo "You must have AWS_ACCESS_KEY_ID set in your environment" && exit 1
[ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "You must have AWS_SECRET_ACCESS_KEY set in your environment" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1

ENV=$1
BUCKET_NAME_EAST="${EFCMS_DOMAIN}.efcms.${ENV}.us-east-1.lambdas"
BUCKET_NAME_WEST="${EFCMS_DOMAIN}.efcms.${ENV}.us-west-1.lambdas"

DEPLOYING_COLOR=$(./scripts/get-deploying-color.sh ${ENV})
CURRENT_COLOR=$(./scripts/get-current-color.sh ${ENV})

aws s3 cp s3://${BUCKET_NAME_EAST}/maintenance_notify_${DEPLOYING_COLOR}.js.zip s3://${BUCKET_NAME_EAST}/maintenance_notify_${CURRENT_COLOR}.js.zip
aws s3 cp s3://${BUCKET_NAME_WEST}/maintenance_notify_${DEPLOYING_COLOR}.js.zip s3://${BUCKET_NAME_WEST}/maintenance_notify_${CURRENT_COLOR}.js.zip
