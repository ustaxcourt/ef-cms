#!/bin/bash

# Returns the environment associated with each branch

# Usage
#   ./get-env.sh develop

# Arguments
#   - $1 - the branch to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if  [[ $BRANCH == 'develop' ]] ; then
  echo 'dev'
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo 'exp1'
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo 'exp2'
elif [[ $BRANCH == 'experimental3' ]] ; then
  echo 'exp3'
elif [[ $BRANCH == 'experimental4' ]] ; then
  echo 'exp4'
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
