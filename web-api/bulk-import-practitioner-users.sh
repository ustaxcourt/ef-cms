#!/bin/bash -e

#
# This script is used for importing a list of practitioner users from a provided .csv file
#
# Arguments
#   - $1 - the environment [dev, stg, prod, exp1, etc]
#   - $2 - the path to the CSV file to import.  See the practitioner_users.csv for an example

[ -z "$1" ] && echo "The ENV to deploy to must be provided as the \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1
[ -z "$2" ] && echo "The FILE_NAME must be provided as the \$2 argument.  An example value of this includes './practitioner_users.csv'" && exit 1
[ -z "${AWS_ACCESS_KEY_ID}" ] && echo "You must have AWS_ACCESS_KEY_ID set in your environment" && exit 1
[ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "You must have AWS_SECRET_ACCESS_KEY set in your environment" && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo "You must have DEPLOYING_COLOR set in your environment" && exit 1

ENV=$1
REGION="us-east-1"
FILE_NAME=$2

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}" --output text)

export ENV
export REGION

STAGE="${ENV}" \
    DEPLOYING_COLOR="${DEPLOYING_COLOR}" \
    DOCUMENTS_BUCKET_NAME="${EFCMS_DOMAIN}-documents-${ENV}-${REGION}" \
    USER_POOL_ID="${USER_POOL_ID}" \
    npx ts-node --transpile-only ./bulkImportPractitionerUsers.ts "${FILE_NAME}" >> bulk-import-log.txt
