#!/bin/bash

# Returns the migration source table for the environment

# Usage
#   ./get-source-table.sh dev

# Arguments
#   - $1 - the environment to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if  [[ $BRANCH == 'develop' ]] ; then
  echo 'efcms-dev-1'
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo 'efcms-exp1-1'
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo 'efcms-exp2-1'
elif [[ $BRANCH == 'irs' ]] ; then
  echo 'efcms-irs-1'
elif [[ $BRANCH == 'test' ]] ; then
  echo 'efcms-test-1'
elif [[ $BRANCH == 'migration' ]] ; then
  echo 'efcms-mig-1'
elif [[ $BRANCH == 'staging' ]] ; then
  echo 'efcms-stg-1'
elif [[ $BRANCH == 'master' ]] ; then
  echo 'efcms-prod-1'
elif [[ $BRANCH == 'dawson' ]] ; then
  echo 'efcms-daw-1'
elif [[ $BRANCH == 'prod' ]] ; then
  echo 'efcms-prod-1'
else
  exit 1;
fi
