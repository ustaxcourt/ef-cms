#!/bin/bash

# Returns the migration elasticsearch domain for the environment

# Usage
#   ./get-destination-elasticsearch.sh dev

# Arguments
#   - $1 - the environment to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if  [[ $BRANCH == 'develop' ]] ; then
  echo 'efcms-search-dev-2'
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo 'efcms-search-exp1-2'
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo 'efcms-search-exp2-2'
elif [[ $BRANCH == 'experimental3' ]] ; then
  echo 'efcms-search-exp3-2'
elif [[ $BRANCH == 'irs' ]] ; then
  echo 'efcms-search-irs-2'
elif [[ $BRANCH == 'test' ]] ; then
  echo 'efcms-search-test-2'
elif [[ $BRANCH == 'migration' ]] ; then
  echo 'efcms-search-mig-2'
elif [[ $BRANCH == 'staging' ]] ; then
  echo 'efcms-search-stg-2'
elif [[ $BRANCH == 'master' ]] ; then
  echo 'efcms-search-prod-2'
elif [[ $BRANCH == 'dawson' ]] ; then
  echo 'efcms-search-daw-2'
elif [[ $BRANCH == 'prod' ]] ; then
  echo 'efcms-search-prod-2'
else
  exit 1;
fi
