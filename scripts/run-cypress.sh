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
   echo "Syntax: ./scripts/run-cypress.sh [-c|f|h|l|o|p|r|s|t <FILE>]"
   echo "options:"
   echo "c     Run smoketests against the currently deployed color rather than the deploying color. -s or -r should also be used."
   echo "f     Enable fail-fast mode for smoketests (stops on first failure but preserves artifacts). Should be used with -s or -r."
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
while getopts ":cfhloprst:" option; do
   case $option in
      c) # run against currently deployed color
         CURRENT=true
         ;;
      f) # enable fail-fast mode
         FAIL_FAST=true
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

# Validate fail-fast option usage
if [ -n "${FAIL_FAST}" ] && [ -z "${SMOKETESTS}" ]; then
  echo "Error: Fail-fast mode (-f) can only be used with smoketests (-s or -r option)"
  exit 1
fi

# Create results directory for JUnit reporter if using fail-fast mode
if [ -n "${FAIL_FAST}" ] && [ -n "${SMOKETESTS}" ]; then
  mkdir -p cypress/results
fi

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
  export CYPRESS_SMOKETEST_BUCKET="${EFCMS_DOMAIN}-email-inbox-${ENV}-us-east-1"
  DYNAMODB_TABLE_NAME=$(./scripts/dynamo/get-destination-table.sh "${ENV}")
  export CYPRESS_DYNAMODB_TABLE_NAME=$DYNAMODB_TABLE_NAME
  export CYPRESS_DYNAMODB_DEPLOY_TABLE_NAME="efcms-deploy-${ENV}"
  CYPRESS_MIGRATE=$(./scripts/migration/get-migrate-flag.sh "${ENV}")
  export CYPRESS_MIGRATE=$CYPRESS_MIGRATE
  export CYPRESS_DATABASE_NAME=$DATABASE_NAME
  export CYPRESS_POSTGRES_HOST=$POSTGRES_HOST
  export CYPRESS_POSTGRES_PASSWORD=$POSTGRES_PASSWORD
  export CYPRESS_POSTGRES_USER=$POSTGRES_USER
fi	

if [ -n "${OPEN}" ]; then
  ./node_modules/.bin/cypress open --browser "${BROWSER}" -C "${CONFIG_FILE}"
else
  CYPRESS_ARGS="--browser ${BROWSER} -C ${CONFIG_FILE}"
  [ -n "${RUN_SPECIFIC_TEST}" ] && CYPRESS_ARGS="${CYPRESS_ARGS} --spec ${RUN_SPECIFIC_TEST// /,}"
  [ -n "${FAIL_FAST}" ] && [ -n "${SMOKETESTS}" ] && CYPRESS_ARGS="${CYPRESS_ARGS} --reporter junit --reporter-options mochaFile=cypress/results/results-[hash].xml"
  
  ./node_modules/.bin/cypress run "${CYPRESS_ARGS}" || {
    [ -n "${FAIL_FAST}" ] && [ -n "${SMOKETESTS}" ] && echo "Tests failed in fail-fast mode, but artifacts will be preserved"
    exit 1
  }
fi
