#!/bin/bash -e

# This runs the post-deploy smoke tests
# rm -rf node_modules dist .elasticsearch .dynamodb
# npm ci

docker build -t efcms -f Dockerfile-local .

docker run -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
           -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
           -e CYPRESS_BASE_URL=$CYPRESS_BASE_URL \
           -e EFCMS_DOMAIN=$EFCMS_DOMAIN \
           -e ENV=$ENV \
           -e DEFAULT_ACCOUNT_PASS=$DEFAULT_ACCOUNT_PASS$ \
           -e DEPLOYING_COLOR=$DEPLOYING_COLOR \
           --rm efcms /bin/sh \
           -c 'npm run cypress:smoketests && npm run test:pa11y:smoketests'
