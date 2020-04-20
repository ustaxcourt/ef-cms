#!/bin/bash

BRANCH=$1

if [[ $BRANCH == 'develop' ]] ; then
  echo "${POST_CONFIRMATION_ROLE_ARN_DEV}"
elif [[ $BRANCH == 'experimental' ]]  ; then
  echo "${POST_CONFIRMATION_ROLE_ARN_EXP}"
elif [[ $BRANCH == 'irs' ]]  ; then
  echo "${POST_CONFIRMATION_ROLE_ARN_IRS}"
elif [[ $BRANCH == 'master' ]] ; then
  echo "${POST_CONFIRMATION_ROLE_ARN_PROD}"
elif [[ $BRANCH == 'staging' ]]  ; then
  echo "${POST_CONFIRMATION_ROLE_ARN_STG}"
elif [[ $BRANCH == 'test' ]]  ; then
  echo "${POST_CONFIRMATION_ROLE_ARN_TEST}"
elif [[ $BRANCH == 'migration' ]]  ; then
  echo "${POST_CONFIRMATION_ROLE_ARN_MIG}"
else
  exit 1;
fi
