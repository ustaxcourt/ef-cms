#!/bin/bash

# Returns the next color to deploy (blue or green) for the environment

# Usage
#   ./get-efcms-domain.sh develop

# Arguments
#   - $1 - the branch to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if  [[ $BRANCH == 'develop' ]] ; then
  echo "${DEPLOYING_COLOR_DEV}"
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo "${DEPLOYING_COLOR_EXP1}"
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo "${DEPLOYING_COLOR_EXP2}"
elif [[ $BRANCH == 'irs' ]] ; then
  echo "${DEPLOYING_COLOR_IRS}"
elif [[ $BRANCH == 'test' ]] ; then
  echo "${DEPLOYING_COLOR_TEST}"
elif [[ $BRANCH == 'migration' ]] ; then
  echo "${DEPLOYING_COLOR_MIG}"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "${DEPLOYING_COLOR_STG}"
elif [[ $BRANCH == 'master' ]] ; then
  echo "${DEPLOYING_COLOR_PROD}"
elif [[ $BRANCH == 'prod' ]] ; then
  echo "${DEPLOYING_COLOR_PROD}"
else
  exit 1;
fi
