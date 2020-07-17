#!/bin/bash -e

# This runs the post-deply smoke tests
# rm -rf node_modules dist .elasticsearch .dynamodb
# npm ci

docker build -t efcms -f Dockerfile .

docker run -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
           -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
           -e CYPRESS_BASE_URL=$CYPRESS_BASE_URL \
           -e EFCMS_DOMAIN=$EFCMS_DOMAIN \
           -e ENV=$ENV \
           --rm efcms /bin/sh \
           -c 'npm run cypress:smoketests && npm run test:pa11y:smoketests'
