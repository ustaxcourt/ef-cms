#!/bin/bash

BRANCH=$1

if [[ $BRANCH == 'develop' ]] || [[ $BRANCH == 'experimental' ]] ; then
  echo "${CLOUDWATCH_ROLE_ARN_DEV}"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "${CLOUDWATCH_ROLE_ARN_STG}"
elif [[ $BRANCH == 'master' ]] ; then
  echo "${CLOUDWATCH_ROLE_ARN_PROD}"
else
  exit 1;
fi
