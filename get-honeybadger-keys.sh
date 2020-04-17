#!/bin/bash

BRANCH=$1

if [[ $BRANCH == 'develop' ]] ; then
  echo "${CIRCLE_HONEYBADGER_API_KEY_DEV}"
elif [[ $BRANCH == 'experimental' ]] ; then
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
