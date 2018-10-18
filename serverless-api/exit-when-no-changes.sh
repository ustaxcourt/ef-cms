#!/bin/bash
COUNT=$(git diff --name-only origin/develop | grep serverless-api | wc -l)
if [ $COUNT == "0" ] ; then
  echo "SKIP"
else
  echo "CONTINUE"
fi
