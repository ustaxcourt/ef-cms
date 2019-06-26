#!/bin/bash -e

slsStage=$1
region=$2
layer="serverless-ghostscript.yml"

tar -xvzf runtimes/ghostscript/ghostscript_lambda_layer.tar.gz -C runtimes/ghostscript

SLS_DEPLOYMENT_BUCKET="${EFCMS_DOMAIN}.efcms.${slsStage}.${region}.deploys"
SLS_DEPLOYMENT_BUCKET="${SLS_DEPLOYMENT_BUCKET}" ./node_modules/.bin/sls deploy --config "${layer}" --stage "${slsStage}" --region "${region}" --verbose
