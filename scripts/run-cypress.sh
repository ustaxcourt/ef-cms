#!/bin/bash -e

# sets up environment variables if needed and runs cypress

# Usage
#   ./scripts/run-cypress.sh

## Arguments
##   - $1 - the environment to check {env}

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
   echo "Syntax: scriptTemplate [-c|h|l|o|p|r|s]"
   echo "options:"
   echo "c     Run smoketests against the currently deployed color rather than the deploying color. -s or -r should also be used."
   echo "h     Print this Help."
   echo "l     Run smoketests against the locally running application. -s or -r should also be used."
   echo "o     Run Cypress with the browser open rather than headless. Note that this option is incompatible with -s."
   echo "p     Run tests of the public client."
   echo "r     Run readonly smoketests instead of integration tests. Should not be used with -s."
   echo "s     Run smoketests instead of integration tests. Should not be used with -r option."
   echo
}

############################################################
############################################################
# Main                                                     #
############################################################
############################################################

export COLOR=deploying
INTEGRATION=true
PORT=1234
PROTOCOL=https

# Get the options
while getopts ":chloprs" option; do
   case $option in
      c) # run against currently deployed color
         export COLOR=current
         ;;
      h) # display Help
         Help
         exit;;
      l) # local
         export SMOKETESTS_LOCAL=true
         ;;
      o) # open cypress
         OPEN=true
         ;;
      p) # run against the public client
         PORT=5678
         PUBLIC=-public
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
     \?) # Invalid option
         echo "An unsupported option was used. Run with the -h option to see supported options."
         ;;
   esac
done

if [ -n "${CI}" ]; then
  echo "Executing ${0}."
else
  echo "Executing ${0}. For information about available options, run this script again with the -h option for help."
fi

CONFIG_FILE="cypress${SMOKETESTS}${READONLY}${PUBLIC}.config.js"
echo "${CONFIG_FILE}"

if [ -n "${INTEGRATION}" ]; then
  echo "Running integration tests."
  export TEMP_DOCUMENTS_BUCKET_NAME=noop-temp-documents-local-us-east-1
  export QUARANTINE_BUCKET_NAME=noop-quarantine-local-us-east-1
  export DOCUMENTS_BUCKET_NAME=noop-documents-local-us-east-1
  export S3_ENDPOINT=http://localhost:9000
  export MASTER_DYNAMODB_ENDPOINT=http://localhost:8000
  export SLS_DEPLOYMENT_BUCKET=noop
  export AWS_ACCESS_KEY_ID=S3RVER
  export AWS_SECRET_ACCESS_KEY=S3RVER
  export SKIP_CACHE_INVALIDATION=true
  export CHECK_DEPLOY_DATE_INTERVAL=5000
else
  if [ -z "${ENV}" ]; then
    echo "Please export the environment name as a variable named ENV."
    exit 1;
  fi

  . ./scripts/setup-cypress-variables.sh
  if [ -n "${SMOKETESTS_LOCAL}" ]; then
    export CYPRESS_BASE_URL="http://localhost:${PORT}"
  else
    export CYPRESS_BASE_URL="https://app-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}"
  fi
fi

if [ -n "${OPEN}" ]; then
  cypress open -C "${CONFIG_FILE}" --env "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY,AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN,DEFAULT_ACCOUNT_PASS=$DEFAULT_ACCOUNT_PASS,DEPLOYING_COLOR=$DEPLOYING_COLOR,DISABLE_EMAILS=$DISABLE_EMAILS,EFCMS_DOMAIN=$EFCMS_DOMAIN,ENV=$ENV,USTC_ADMIN_PASS=$USTC_ADMIN_PASS"
else
  cypress run -C "${CONFIG_FILE}" --env "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY,AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN,DEFAULT_ACCOUNT_PASS=$DEFAULT_ACCOUNT_PASS,DEPLOYING_COLOR=$DEPLOYING_COLOR,DISABLE_EMAILS=$DISABLE_EMAILS,EFCMS_DOMAIN=$EFCMS_DOMAIN,ENV=$ENV,USTC_ADMIN_PASS=$USTC_ADMIN_PASS"
fi
