#!/bin/bash

# Sets the maintenance mode flag to the passed in value in the dynamo deploy table

# Usage
#   ./engage-maintenance-mode.sh true dev

# Arguments
#   - $1 - true to engage maintenance mode, false to disengage maintenance mode
#   - $2 - the environment to set the flag

[ -z "$1" ] && echo "The value to set for the maintenance mode flag must be provided as the \$1 argument." && exit 1
[ -z "$2" ] && echo "The environment must be provided as the \$2 argument." && exit 1

VALUE=$1
ENV=$2

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"maintenance-mode"},"sk":{"S":"maintenance-mode"},"current":{"S":"'${VALUE}'"}}'

