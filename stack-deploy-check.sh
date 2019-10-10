#!/bin/bash

STACK_NAME=$1       # ex: api, caseDocuments
STACK_PATTERN=$2    # ex: serverless-api, serverless-cases
COMPARE_BRANCH=$3   # ex: develop, staging
ENV=$4              # ex: exp, stg, dev
REGION=$5           # ex: us-east-1, us-west-1

echo "stack name ${1} ${STACK_NAME}"
echo "stack pattern ${2} ${STACK_PATTERN}"
echo "compare branch ${3} ${COMPARE_BRANCH}"
echo "env ${4} ${ENV}"
echo "region ${5} ${REGION}"

REDEPLOY_VIA_DEPS=$(git --no-pager diff --name-only origin/${COMPARE_BRANCH} | node ./web-api/dependency-tree-check.js ${STACK_NAME})
REDEPLOY_VIA_SLS=$(git --no-pager diff --name-only origin/${COMPARE_BRANCH} | grep -c "${STACK_PATTERN}" || test $? = 1)

if [[ -n "$REDEPLOY_VIA_DEPS" ]] || [[ "$REDEPLOY_VIA_SLS" != "0" ]]; then
  ./web-api/run-${STACK_PATTERN}.sh "${ENV}" "${REGION}"
fi