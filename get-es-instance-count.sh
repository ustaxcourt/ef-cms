#!/bin/bash

# Returns the elasticsearch instance count defined in each environment

# Usage
#   ./get-keys.sh develop

# Arguments
#   - $1 - the branch to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if [[ $BRANCH == 'develop' ]] ; then
  echo "3"
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo "3"
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo "3"
elif [[ $BRANCH == 'experimental3' ]] ; then
  echo "3"
elif [[ $BRANCH == 'experimental4' ]] ; then
  echo "4"
elif [[ $BRANCH == 'irs' ]] ; then
  echo "3"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "3"
elif [[ $BRANCH == 'test' ]] ; then
  echo "3"
elif [[ $BRANCH == 'migration' ]] ; then
  echo "3"
elif [[ $BRANCH == 'master' ]] ; then
  echo "3"
elif [[ $BRANCH == 'dawson' ]] ; then
  echo "3"
elif [[ $BRANCH == 'prod' ]] ; then
  echo "3"
else
  exit 1;
fi
