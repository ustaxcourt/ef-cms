#!/bin/bash

node ./switch-public-ui-colors.js
node ./switch-ui-colors.js

aws dynamodb put-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --item '{"pk":{"S":"current-color"},"sk":{"S":"current-color"},"current":{"S":"'$DEPLOYING_COLOR'"}}'
