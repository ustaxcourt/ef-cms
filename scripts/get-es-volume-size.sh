#!/bin/bash

# Returns the elasticsearch volume size defined in each environment

# Usage
#   ./get-es-volume-size.sh develop

# Arguments
#   - $1 - the branch to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if [[ $BRANCH == 'develop' ]] ; then
  echo "10"
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo "10"
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo "10"
elif [[ $BRANCH == 'experimental3' ]] ; then
  echo "10"
elif [[ $BRANCH == 'experimental4' ]] ; then
  echo "10"
elif [[ $BRANCH == 'experimental5' ]] ; then
  echo "10"
elif [[ $BRANCH == 'irs' ]] ; then
  echo "10"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "10"
elif [[ $BRANCH == 'test' ]] ; then
  echo "350"
elif [[ $BRANCH == 'migration' ]] ; then
  echo "350"
elif [[ $BRANCH == 'master' ]] ; then
  echo "100"
elif [[ $BRANCH == 'dawson' ]] ; then
  echo "100"
elif [[ $BRANCH == 'prod' ]] ; then
  echo "350"
else
  exit 1;
fi
