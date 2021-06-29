#!/bin/bash

# Returns the dynamsoft key defined in each environment

# Usage
#   ./get-keys.sh develop

# Arguments
#   - $1 - the branch to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1


BRANCH=$1

if [[ $BRANCH == 'develop' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_DEV}"
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_EXP}"
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_EXP}"
elif [[ $BRANCH == 'experimental3' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_EXP}"
elif [[ $BRANCH == 'experimental4' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_EXP}"
elif [[ $BRANCH == 'experimental5' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_EXP}"
elif [[ $BRANCH == 'irs' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_IRS}"
elif [[ $BRANCH == 'master' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_PROD}"
elif [[ $BRANCH == 'prod' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_PROD}"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_STG}"
elif [[ $BRANCH == 'test' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_TEST}"
elif [[ $BRANCH == 'migration' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_MIG}"
elif [[ $BRANCH == 'dawson' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_DAWSON}"
else
  exit 1;
fi
