#!/bin/bash

# Returns the migration destination table for the environment

# Usage
#   ./get-destination-table.sh dev

# Arguments
#   - $1 - the environment to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if  [[ $BRANCH == 'develop' ]] ; then
  echo 'efcms-dev-2'
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo 'efcms-exp1-2'
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo 'efcms-exp2-2'
elif [[ $BRANCH == 'irs' ]] ; then
  echo 'efcms-irs-2'
elif [[ $BRANCH == 'test' ]] ; then
  echo 'efcms-test-2'
elif [[ $BRANCH == 'migration' ]] ; then
  echo 'efcms-mig-2'
elif [[ $BRANCH == 'staging' ]] ; then
  echo 'efcms-stg-2'
elif [[ $BRANCH == 'master' ]] ; then
  echo 'efcms-prod-2'
elif [[ $BRANCH == 'dawson' ]] ; then
  echo 'efcms-daw-2'
elif [[ $BRANCH == 'prod' ]] ; then
  echo 'efcms-prod-2'
else
  exit 1;
fi
