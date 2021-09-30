#!/bin/bash

# Returns the DEFAULT_ACCOUNT_PASS associated with each branch

# Usage
#   ./get-default-account-pass.sh develop

# Arguments
#   - $1 - the branch to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if  [[ $BRANCH == 'develop' && "$DEFAULT_ACCOUNT_PASS_DEV" ]] ; then
  echo "${DEFAULT_ACCOUNT_PASS_DEV}"
elif [[ $BRANCH == 'experimental1' && "$DEFAULT_ACCOUNT_PASS_EXP1" ]] ; then
  echo "${DEFAULT_ACCOUNT_PASS_EXP1}"
elif [[ $BRANCH == 'experimental2' && "$DEFAULT_ACCOUNT_PASS_EXP2" ]] ; then
  echo "${DEFAULT_ACCOUNT_PASS_EXP2}"
elif [[ $BRANCH == 'experimental3' && "$DEFAULT_ACCOUNT_PASS_EXP3" ]] ; then
  echo "${DEFAULT_ACCOUNT_PASS_EXP3}"
elif [[ $BRANCH == 'experimental4' && "$DEFAULT_ACCOUNT_PASS_EXP4" ]] ; then
  echo "${DEFAULT_ACCOUNT_PASS_EXP4}"
elif [[ $BRANCH == 'experimental5' && "$DEFAULT_ACCOUNT_PASS_EXP5" ]] ; then
  echo "${DEFAULT_ACCOUNT_PASS_EXP5}"
elif [[ $BRANCH == 'irs' && "$DEFAULT_ACCOUNT_PASS_IRS" ]] ; then
  echo "${DEFAULT_ACCOUNT_PASS_IRS}"
elif [[ $BRANCH == 'test' && "$DEFAULT_ACCOUNT_PASS_TEST" ]] ; then
  echo "${DEFAULT_ACCOUNT_PASS_TEST}"
elif [[ $BRANCH == 'migration' && "$DEFAULT_ACCOUNT_PASS_MIG" ]] ; then
  echo "${DEFAULT_ACCOUNT_PASS_MIG}"
elif [[ $BRANCH == 'staging' && "$DEFAULT_ACCOUNT_PASS_STG" ]] ; then
  echo "${DEFAULT_ACCOUNT_PASS_STG}"
elif [[ $BRANCH == 'master' && "$DEFAULT_ACCOUNT_PASS_PROD" ]] ; then
  echo "${DEFAULT_ACCOUNT_PASS_PROD}"
elif [[ $BRANCH == 'prod' && "$DEFAULT_ACCOUNT_PASS_PROD" ]] ; then
  echo "${DEFAULT_ACCOUNT_PASS_PROD}"
else
  echo "${DEFAULT_ACCOUNT_PASS}"
fi
