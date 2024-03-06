#!/bin/bash -e

# clears and reinitializes the current active dynamo and elasticsearch instances

# Usage
#   ./clear-env.sh

############################################################
# Help                                                     #
############################################################
Help()
{
   # Display Help
   echo "This script sets up the variables for Cypress and then runs the appropriate tests."
   echo "It defaults to running integration tests with a headless browser."
   echo "Adding one or more of the options listed below allows running different tests and/or running them differently."
   echo
   echo "Syntax: ./clear-env.sh [-d|h|q]"
   echo "options:"
   echo "d     Run against deploying color instead of current color."
   echo "h     Print this Help."
   echo "q     Run the script in quiet mode (i.e. CI=true to suppress interactions)."
   echo
}

# Get the options
while getopts ":dhq" option; do
   case $option in
      d) # run against deploying color
         DEPLOYING=true
         ;;
      h) # display Help
         Help
         exit;;
      q) # run in quiet mode
         export CI=true
         ;;
     \?) # Invalid option
         echo "An unsupported option was used. Run with the -h option to see supported options."
         ;;
   esac
done

# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh

./check-env-variables.sh \
  "USTC_ADMIN_PASS" \
  "AWS_ACCESS_KEY_ID" \
  "AWS_SECRET_ACCESS_KEY" \
  "DEFAULT_ACCOUNT_PASS" \
  "ENV" \
  "USTC_ADMIN_USER" \
  "EFCMS_DOMAIN"

export REGION=us-east-1

( ! command -v terraform > /dev/null ) && echo "Terraform was not found on your path. Please install terraform." && exit 1
( ! command -v node > /dev/null ) && echo "node was not found on your path. Please install node." && exit 1
( ! command -v aws > /dev/null ) && echo "aws was not found on your path. Please install aws." && exit 1

if [ -n "${DEPLOYING}" ]; then
  DEPLOYING_COLOR=$(./scripts/dynamo/get-deploying-color.sh "${ENV}")
else
  # we use the current-color from dynamo but name the variable DEPLOYING_COLOR since it's needed in the import judge script
  DEPLOYING_COLOR=$(./scripts/dynamo/get-current-color.sh "${ENV}")
fi

SOURCE_TABLE_VERSION=$(aws dynamodb get-item \
  --region us-east-1 \
  --table-name "efcms-deploy-${ENV}" \
  --key '{"pk":{"S":"source-table-version"},"sk":{"S":"source-table-version"}}' | jq -r ".Item.current.S")

ELASTICSEARCH_ENDPOINT=$(aws es describe-elasticsearch-domain \
  --domain-name "efcms-search-${ENV}-${SOURCE_TABLE_VERSION}" \
  --region us-east-1 \
  --query 'DomainStatus.Endpoint' \
  --output text)

export SOURCE_TABLE_VERSION
export ELASTICSEARCH_ENDPOINT
export DEPLOYING_COLOR
export FILE_NAME=./scripts/circleci/judge/judge_users.csv

echo "clearing elasticsearch"
./web-api/clear-elasticsearch-index.sh "${ENV}" "${ELASTICSEARCH_ENDPOINT}"
echo "setting up elasticsearch"
./web-api/setup-elasticsearch-index.sh "${ENV}"
./web-api/setup-elasticsearch-aliases.sh "${ENV}"

echo "clearing dynamo"
npx ts-node --transpile-only ./web-api/clear-dynamodb-table.ts "efcms-${ENV}-${SOURCE_TABLE_VERSION}"
echo "setting up test users"
# shellcheck disable=SC1091
. ./scripts/user/setup-test-users.sh "${ENV}"
echo "importing judge users"
./scripts/circleci/judge/bulk-import-judge-users.sh
