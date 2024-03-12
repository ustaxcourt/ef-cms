#!/bin/bash -e

# sets up environment variables if needed and runs cypress

# Usage
#   ./scripts/run-cypress.sh

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
   echo "Syntax: ./scripts/run-cypress.sh [-c|h|l|o|p|r|s|t <FILE>]"
   echo "options:"
   echo "c     Run smoketests against the currently deployed color rather than the deploying color. -s or -r should also be used."
   echo "h     Print this Help."
   echo "l     Run smoketests against the locally running application. -s or -r should also be used."
   echo "o     Run Cypress with the browser open rather than headless. Note that this option is incompatible with -s."
   echo "p     Run tests of the public client."
   echo "r     Run readonly smoketests instead of integration tests. Should not be used with -s."
   echo "s     Run smoketests instead of integration tests. Should not be used with -r option."
   echo "t     Run a specific test file. (e.g: ./scripts/run-cypress.sh -t path/to/test-file.spec.ts)"
   echo
}

############################################################
############################################################
# Main                                                     #
############################################################
############################################################

INTEGRATION=true
PORT=1234
NON_PUBLIC=app-
BROWSER=edge
RUN_SPECIFIC_TEST=""

# Get the options
while getopts ":chloprst:" option; do
   case $option in
      c) # run against currently deployed color
         CURRENT=true
         ;;
      h) # display Help
         Help
         exit;;
      l) # local
         export CYPRESS_SMOKETESTS_LOCAL=true
         ;;
      o) # open cypress
         OPEN=true
         ;;
      p) # run against the public client
         BROWSER=chrome
         PORT=5678
         PUBLIC=-public
         unset NON_PUBLIC
         ;;
      r) # run the readonly smoketests (this encompasses the -s option)
         unset INTEGRATION
         READONLY=-readonly
         SMOKETESTS=-smoketests
         ;;
      s) # run the smoketests
         unset INTEGRATION
         SMOKETESTS=-smoketests
         ;;
      t) # run a speecific test
         RUN_SPECIFIC_TEST=$OPTARG
         ;;
      \?) # Invalid option
         echo "An unsupported option was used. Run with the -h option to see supported options."
         ;;
   esac
done

if [ -n "${CI}" ]; then
  export CYPRESS_NO_COMMAND_LOG=1 #Disable logging of commands in CI to not leak secrets
  echo "Executing ${0}."
else
  echo "Executing ${0}. For information about available options, run this script again with the -h option for help."
fi

CONFIG_FILE="cypress${SMOKETESTS}${READONLY}${PUBLIC}.config.ts"
echo "${CONFIG_FILE}"

export CYPRESS_TARGET_ENV=$ENV

if [ -n "${INTEGRATION}" ]; then
  echo "Running integration tests."
  export CYPRESS_TEMP_DOCUMENTS_BUCKET_NAME=noop-temp-documents-local-us-east-1
  export CYPRESS_QUARANTINE_BUCKET_NAME=noop-quarantine-local-us-east-1
  export CYPRESS_DOCUMENTS_BUCKET_NAME=noop-documents-local-us-east-1
  export CYPRESS_S3_ENDPOINT=http://0.0.0.0:9000
  export CYPRESS_SLS_DEPLOYMENT_BUCKET=noop
  export CYPRESS_AWS_ACCESS_KEY_ID=S3RVER
  export CYPRESS_AWS_SECRET_ACCESS_KEY=S3RVER
  export CYPRESS_CHECK_DEPLOY_DATE_INTERVAL=5000
elif [ -n "${CYPRESS_SMOKETESTS_LOCAL}" ]; then
  export CYPRESS_BASE_URL="http://localhost:${PORT}"
else
  if [ -z "${ENV}" ]; then
    echo "Please export the environment name as a variable named ENV."
    exit 1;
  fi

  # shellcheck disable=SC1091
  . ./scripts/setup-cypress-variables.sh
  export CYPRESS_AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
  export CYPRESS_AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
  export CYPRESS_AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN
  export CYPRESS_DEFAULT_ACCOUNT_PASS=$DEFAULT_ACCOUNT_PASS
  if [ -n "${CURRENT}" ]; then
    export CYPRESS_DEPLOYING_COLOR=$CURRENT_COLOR
  else
    export CYPRESS_DEPLOYING_COLOR=$DEPLOYING_COLOR
  fi
  export CYPRESS_DISABLE_EMAILS=$DISABLE_EMAILS
  export CYPRESS_EFCMS_DOMAIN=$EFCMS_DOMAIN
  export CYPRESS_USTC_ADMIN_PASS=$USTC_ADMIN_PASS
  export CYPRESS_BASE_URL="https://${NON_PUBLIC}${CYPRESS_DEPLOYING_COLOR}.${EFCMS_DOMAIN}"
  DYNAMODB_TABLE_NAME=$(./scripts/dynamo/get-destination-table.sh "${ENV}")
  export CYPRESS_DYNAMODB_TABLE_NAME=$DYNAMODB_TABLE_NAME
  CYPRESS_MIGRATE=$(./scripts/dynamo/get-migrate-flag.sh "${ENV}")
  export CYPRESS_MIGRATE=$CYPRESS_MIGRATE
fi

if [ -n "${OPEN}" ]; then
  ./node_modules/.bin/cypress open --browser "${BROWSER}" -C "${CONFIG_FILE}"
else
  if [ -n "${RUN_SPECIFIC_TEST}" ]; then
    ./node_modules/.bin/cypress run --browser "${BROWSER}" -C "${CONFIG_FILE}" --spec "${RUN_SPECIFIC_TEST}"
  else 
    ./node_modules/.bin/cypress run --browser "${BROWSER}" -C "${CONFIG_FILE}"
  fi    
fi
