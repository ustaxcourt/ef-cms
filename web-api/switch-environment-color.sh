#!/bin/bash -e

# Usage
#   used for changing the environment's api from one color to the next

# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, exp1, etc]

[ -z "$1" ] && echo "The slsStage to deploy to must be provided as the \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1
[ -z "${AWS_ACCESS_KEY_ID}" ] && echo "You must have AWS_ACCESS_KEY_ID set in your environment" && exit 1
[ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "You must have AWS_SECRET_ACCESS_KEY set in your environment" && exit 1

slsStage="${1}"

CURRENT_COLOR=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${slsStage}" --key '{"pk":{"S":"deployed-stack"},"sk":{"S":"deployed-stack"}}' | jq -r ".Item.current.S")

if [[ $CURRENT_COLOR == 'green' ]] ; then
  NEW_COLOR='blue'
else
  NEW_COLOR='green'
fi

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${slsStage}" --item '{"pk":{"S":"deployed-stack"},"sk":{"S":"deployed-stack"},"current":{"S":"'$NEW_COLOR'"}}'

# switch base path mappings to new color
node switch-environment-color.js "${slsStage}" 'us-east-1' "${CURRENT_COLOR}" "${NEW_COLOR}"
node switch-environment-color.js "${slsStage}" 'us-west-1' "${CURRENT_COLOR}" "${NEW_COLOR}"

echo "changed environment to ${NEW_COLOR}"
