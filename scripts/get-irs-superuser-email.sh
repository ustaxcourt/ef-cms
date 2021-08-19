#!/bin/bash

# Returns the IRS superuser email associated with each branch

# Usage
#   ./get-irs-superuser-email.sh develop

# Arguments
#   - $1 - the branch to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if  [[ $BRANCH == 'develop' ]] ; then
  echo "${IRS_SUPERUSER_EMAIL_DEV}"
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo "${IRS_SUPERUSER_EMAIL_EXP1}"
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo "${IRS_SUPERUSER_EMAIL_EXP2}"
elif [[ $BRANCH == 'experimental3' ]] ; then
  echo "${IRS_SUPERUSER_EMAIL_EXP3}"
elif [[ $BRANCH == 'experimental4' ]] ; then
  echo "${IRS_SUPERUSER_EMAIL_EXP4}"
elif [[ $BRANCH == 'experimental5' ]] ; then
  echo "${IRS_SUPERUSER_EMAIL_EXP5}"
elif [[ $BRANCH == 'irs' ]] ; then
  echo "${IRS_SUPERUSER_EMAIL_IRS}"
elif [[ $BRANCH == 'test' ]] ; then
  echo "${IRS_SUPERUSER_EMAIL_TEST}"
elif [[ $BRANCH == 'migration' ]] ; then
  echo "${IRS_SUPERUSER_EMAIL_MIG}"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "${IRS_SUPERUSER_EMAIL_STG}"
elif [[ $BRANCH == 'master' ]] ; then
  echo "${IRS_SUPERUSER_EMAIL_PROD}"
elif [[ $BRANCH == 'prod' ]] ; then
  echo "${IRS_SUPERUSER_EMAIL_PROD}"
else
  exit 1;
fi
