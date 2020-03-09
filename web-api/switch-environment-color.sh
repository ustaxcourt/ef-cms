#!/bin/bash -e

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
