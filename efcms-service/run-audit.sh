#!/bin/bash -e
ISSUE_COUNT=$(npm audit --json | jq -r '.actions' | jq -r '.[] | .module' | grep -cv -e 'serialize-to-js' -e 'serverless-dynamodb-local' | tr -d ' ')
if [ "${ISSUE_COUNT}" -ne "0" ] ; then
  echo "Audit issues found"
  exit 1;
fi
