#!/bin/bash

# Returns the honeybadger key defined in each environment

# Usage
#   ./get-honeybadger-keys.sh develop

# Arguments
#   - $1 - the branch to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if [[ $BRANCH == 'develop' ]] ; then
  echo "${CIRCLE_HONEYBADGER_API_KEY_DEV}"
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo ""
elif [[ $BRANCH == 'master' ]] ; then
  echo ""
elif [[ $BRANCH == 'staging' ]] ; then
  echo "${CIRCLE_HONEYBADGER_API_KEY_STG}"
elif [[ $BRANCH == 'test' ]] ; then
  echo ""
else
  exit 1;
fi
