#!/bin/bash

# Returns the zone name associated with each branch

# Usage
#   ./get-zone-name.sh develop

# Arguments
#   - $1 - the branch to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if  [[ $BRANCH == 'develop' ]] ; then
  echo "${ZONE_NAME_DEV}"
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo "${ZONE_NAME_EXP1}"
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo "${ZONE_NAME_EXP2}"
elif [[ $BRANCH == 'experimental3' ]] ; then
  echo "${ZONE_NAME_EXP3}"
elif [[ $BRANCH == 'experimental4' ]] ; then
  echo "${ZONE_NAME_EXP4}"
elif [[ $BRANCH == 'experimental5' ]] ; then
  echo "${ZONE_NAME_EXP5}"
elif [[ $BRANCH == 'irs' ]] ; then
  echo "${ZONE_NAME_IRS}"
elif [[ $BRANCH == 'test' ]] ; then
  echo "${ZONE_NAME_TEST}"
elif [[ $BRANCH == 'migration' ]] ; then
  echo "${ZONE_NAME_MIG}"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "${ZONE_NAME_STG}"
elif [[ $BRANCH == 'master' ]] ; then
  echo "${ZONE_NAME_PROD}"
elif [[ $BRANCH == 'prod' ]] ; then
  echo "${ZONE_NAME_PROD}"
else
  exit 1;
fi
