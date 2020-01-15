#!/bin/bash -e

slsStage=$1
region=$2
layer="serverless-puppeteer.yml"

tar -xvzf web-api/runtimes/puppeteer/puppeteer_lambda_layer.tar.gz -C web-api/runtimes/puppeteer

SLS_DEPLOYMENT_BUCKET="${EFCMS_DOMAIN}.efcms.${slsStage}.${region}.deploys"

echo "${SLS_DEPLOYMENT_BUCKET}"

SLS_DEBUG="*" SLS_DEPLOYMENT_BUCKET="${SLS_DEPLOYMENT_BUCKET}" ./node_modules/.bin/sls deploy --config "web-api/${layer}" --stage "${slsStage}" --region "${region}" --verbose
