#!/bin/bash

# Returns the elasticsearch disable emails variable for each environment

# Usage
#   ./get-disable-emails.sh develop

# Arguments
#   - $1 - the branch to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if [[ $BRANCH == 'develop' ]] ; then
  echo "${DISABLE_EMAILS_DEV}"
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo "${DISABLE_EMAILS_EXP1}"
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo "${DISABLE_EMAILS_EXP2}"
elif [[ $BRANCH == 'experimental3' ]] ; then
  echo "${DISABLE_EMAILS_EXP3}"
elif [[ $BRANCH == 'experimental4' ]] ; then
  echo "${DISABLE_EMAILS_EXP4}"
elif [[ $BRANCH == 'irs' ]] ; then
  echo "${DISABLE_EMAILS_IRS}"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "${DISABLE_EMAILS_STG}"
elif [[ $BRANCH == 'test' ]] ; then
  echo "${DISABLE_EMAILS_TEST}"
elif [[ $BRANCH == 'migration' ]] ; then
  echo "${DISABLE_EMAILS_MIG}"
elif [[ $BRANCH == 'master' ]] ; then
  echo "${DISABLE_EMAILS_MASTER}"
elif [[ $BRANCH == 'dawson' ]] ; then
  echo "${DISABLE_EMAILS_DAWSON}"
elif [[ $BRANCH == 'prod' ]] ; then
  echo "${DISABLE_EMAILS_PROD}"
else
  exit 1;
fi
