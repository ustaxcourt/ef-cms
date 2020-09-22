#!/bin/bash

node ./web-client/switch-public-ui-colors.js
echo "in between the switches"
node ./web-client/switch-ui-colors.js

echo "made it past the switch scripts" 

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"current-color"},"sk":{"S":"current-color"},"current":{"S":"'$DEPLOYING_COLOR'"}}'

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"migrate"},"sk":{"S":"migrate"},"current":{"S":"false"}}'
