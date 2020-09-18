#!/bin/bash

# Returns the migration destination table for the environment

# Usage
#   ./get-destination-table.sh dev

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
  echo 'irs'
elif [[ $BRANCH == 'test' ]] ; then
  echo 'test'
elif [[ $BRANCH == 'migration' ]] ; then
  echo 'mig'
elif [[ $BRANCH == 'staging' ]] ; then
  echo 'stg'
elif [[ $BRANCH == 'master' ]] ; then
  echo 'prod'
elif [[ $BRANCH == 'dawson' ]] ; then
  echo 'daw'
elif [[ $BRANCH == 'prod' ]] ; then
  echo 'prod'
else
  exit 1;
fi
