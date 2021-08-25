#!/bin/bash

# Sets up the s3 deploy bucket with blue and green files for each API

# Usage
#   ./setup-s3-deploy-files.sh dev

# Arguments
#   - $1 - the environment to check

[ -z "$1" ] && echo "The environment to check must be provided as the \$1 argument." && exit 1
[ -z "${USTC_ADMIN_PASS}" ] && echo "You must have USTC_ADMIN_PASS set in your environment" && exit 1
[ -z "${AWS_ACCESS_KEY_ID}" ] && echo "You must have AWS_ACCESS_KEY_ID set in your environment" && exit 1
[ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "You must have AWS_SECRET_ACCESS_KEY set in your environment" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1

│ Error: failed getting S3 Bucket (******************************.efcms.exp1.us-east-1.lambdas) Object (maintenance_notify_blue.js.zip): NotFound: Not Found



if [[ "${WEB_API_DEPLOY_OUTPUT}" == *""* ]]; then 
    exit 1 
fi

ENV=$1
BUCKET_NAME="${EFCMS_DOMAIN}.efcms.${ENV}.us-east-1.lambdas"

aws s3 cp s3://${BUCKET_NAME}/maintenance_notify_green.js.zip s3://${BUCKET_NAME}/maintenance_notify_blue.js.zip
