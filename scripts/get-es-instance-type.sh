#!/bin/bash

# Returns the elasticsearch instance count defined in each environment

# Usage
#   ./get-keys.sh develop

# Arguments
#   - $1 - the branch to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if [[ $BRANCH == 'develop' ]] ; then
  echo "t2.small.elasticsearch"
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo "t2.small.elasticsearch"
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo "t2.small.elasticsearch"
elif [[ $BRANCH == 'experimental3' ]] ; then
  echo "t2.small.elasticsearch"
elif [[ $BRANCH == 'experimental4' ]] ; then
  echo "t2.small.elasticsearch"
elif [[ $BRANCH == 'experimental5' ]] ; then
  echo "t2.small.elasticsearch"
elif [[ $BRANCH == 'irs' ]] ; then
  echo "t2.small.elasticsearch"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "t2.medium.elasticsearch"
elif [[ $BRANCH == 'test' ]] ; then
  echo "m5.large.elasticsearch"
elif [[ $BRANCH == 'migration' ]] ; then
  echo "m5.large.elasticsearch"
elif [[ $BRANCH == 'master' ]] ; then
  echo "m5.large.elasticsearch"
elif [[ $BRANCH == 'dawson' ]] ; then
  echo "t2.small.elasticsearch"
elif [[ $BRANCH == 'prod' ]] ; then
  echo "m5.xlarge.elasticsearch"
else
  exit 1;
fi
