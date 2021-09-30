#!/bin/bash

# Sets the maintenance mode flag to the passed in value in the dynamo deploy table

# Usage
#   ./set-maintenance-mode.sh true dev

# Arguments
#   - $1 - true to engage maintenance mode, false to disengage maintenance mode
#   - $2 - the environment to set the flag

[ -z "$1" ] && echo "The value to set for the maintenance mode flag must be provided as the \$1 argument." && exit 1
[ -z "$2" ] && echo "The environment must be provided as the \$2 argument." && exit 1

VALUE=$1
ENV=$2

CURRENT_COLOR=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"current-color"},"sk":{"S":"current-color"}}' | jq -r ".Item.current.S")

aws lambda invoke --region us-east-1 \
  --function-name "send_maintenance_notifications_"${ENV}"_"${CURRENT_COLOR} \
  --payload '{ "maintenanceMode": '${1}' }' \
  --cli-binary-format raw-in-base64-out \
  /dev/null
aws lambda invoke --region us-west-1 \
  --function-name "send_maintenance_notifications_"${ENV}"_"${CURRENT_COLOR} \
  --payload '{ "maintenanceMode": '${1}' }' \
  --cli-binary-format raw-in-base64-out \
  /dev/null
  