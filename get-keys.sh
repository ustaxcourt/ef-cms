#!/bin/bash

BRANCH=$1

if [[ $BRANCH == 'develop' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_DEV}"
elif [[ $BRANCH == 'experimental' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_EXP}"
elif [[ $BRANCH == 'irs' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_IRS}"
elif [[ $BRANCH == 'master' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_PROD}"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_STG}"  
elif [[ $BRANCH == 'test' ]] ; then
  echo "${DYNAMSOFT_PRODUCT_KEYS_TEST}"
else
  exit 1;
fi
