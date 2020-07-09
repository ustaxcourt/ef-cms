#!/bin/bash

# Returns the elasticsearch instance count defined in each environment

# Usage
#   ./get-keys.sh develop

# Arguments
#   - $1 - the branch to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if [[ $BRANCH == 'develop' ]] ; then
  echo "1"
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo "1"
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo "1"
elif [[ $BRANCH == 'irs' ]] ; then
  echo "1"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "1"
elif [[ $BRANCH == 'test' ]] ; then
  echo "1"
elif [[ $BRANCH == 'migration' ]] ; then
  echo "1"
elif [[ $BRANCH == 'master' ]] ; then
  echo "2"
else
  exit 1;
fi
