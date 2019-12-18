#!/bin/bash

BRANCH=$1

if [[ $BRANCH == 'develop' ]] || [[ $BRANCH == 'experimental' ]] ; then
  echo "${POST_CONFIRMATION_ROLE_ARN_DEV}"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "${POST_CONFIRMATION_ROLE_ARN_STG}"
elif [[ $BRANCH == 'master' ]] ; then
  echo "${POST_CONFIRMATION_ROLE_ARN_PROD}"
else
  exit 1;
fi
