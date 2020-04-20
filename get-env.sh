#!/bin/bash

BRANCH=$1

if  [[ $BRANCH == 'develop' ]] ; then
  echo 'dev'
elif [[ $BRANCH == 'experimental' ]] ; then
  echo 'exp'
elif [[ $BRANCH == 'irs' ]] ; then
  echo 'irs'
elif [[ $BRANCH == 'test' ]] ; then
  echo 'test'
elif [[ $BRANCH == 'migration' ]] ; then
  echo 'mig'
elif [[ $BRANCH == 'staging' ]] ; then
  echo 'stg'
elif [[ $BRANCH == 'master' ]] ; then
  echo 'prod'
else
  exit 1;
fi
