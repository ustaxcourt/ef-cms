#!/bin/bash

# Returns the source elasticsearch domain for the environment

# Usage
#   ./get-source-elasticsearch.sh dev

# Arguments
#   - $1 - the environment to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if  [[ $BRANCH == 'develop' ]] ; then
  echo 'efcms-search-dev-1'
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo 'efcms-search-exp1-1'
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo 'efcms-search-exp2-1'
elif [[ $BRANCH == 'irs' ]] ; then
  echo 'efcms-search-irs-1'
elif [[ $BRANCH == 'test' ]] ; then
  echo 'efcms-search-test-1'
elif [[ $BRANCH == 'migration' ]] ; then
  echo 'efcms-search-mig-1'
elif [[ $BRANCH == 'staging' ]] ; then
  echo 'efcms-search-stg-1'
elif [[ $BRANCH == 'master' ]] ; then
  echo 'efcms-search-prod-1'
elif [[ $BRANCH == 'dawson' ]] ; then
  echo 'efcms-search-daw-1'
elif [[ $BRANCH == 'prod' ]] ; then
  echo 'efcms-search-prod-1'
else
  exit 1;
fi
