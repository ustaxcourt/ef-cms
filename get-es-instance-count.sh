#!/bin/bash

BRANCH=$1

if [[ $BRANCH == 'develop' ]] || [[ $BRANCH == 'experimental' ]] ; then
  echo "1"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "1"
elif [[ $BRANCH == 'master' ]] ; then
  echo "2"
else
  exit 1;
fi
