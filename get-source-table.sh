#!/bin/bash

# Returns the migration source table for the environment

# Usage
#   ./get-source-table.sh dev

# Arguments
#   - $1 - the environment to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if  [[ $BRANCH == 'develop' ]] ; then
  echo 'efcms-dev'
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo 'efcms-exp1'
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo 'efcms-dev'
elif [[ $BRANCH == 'irs' ]] ; then
  echo 'efcms-irs'
elif [[ $BRANCH == 'test' ]] ; then
  echo 'efcms-test'
elif [[ $BRANCH == 'migration' ]] ; then
  echo 'efcms-mig'
elif [[ $BRANCH == 'staging' ]] ; then
  echo 'efcms-stg'
elif [[ $BRANCH == 'master' ]] ; then
  echo 'efcms-prod'
elif [[ $BRANCH == 'dawson' ]] ; then
  echo 'efcms-daw'
elif [[ $BRANCH == 'prod' ]] ; then
  echo 'efcms-prod'
else
  exit 1;
fi
