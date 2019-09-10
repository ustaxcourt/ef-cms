#!/bin/bash

BRANCH=$1

if [[ $BRANCH == 'develop' ]] || [[ $BRANCH == 'themis' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_DEV}"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_STG}"
elif [[ $BRANCH == 'master' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_PROD}"
else
  exit 1;
fi
