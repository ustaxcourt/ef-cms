#!/bin/bash -e
FULL_URL="https://sonarcloud.io"
branch_name=$branch_name
OUTPUT=$(sonar-scanner -Dsonar.projectKey="${SONAR_KEY}" -Dsonar.branch.name="${branch_name}" -Dsonar.organization="${SONAR_ORG}" -Dsonar.projectBaseDir=. -Dsonar.login="${SONAR_TOKEN}" -Dsonar.host.url="${FULL_URL}")
sleep 10
CURL_URL="${FULL_URL}/api/qualitygates/project_status?projectKey=${SONAR_KEY}&branch=${branch_name}"
JSON=$(curl -X GET -H 'Accept: application/json' "${CURL_URL}")
echo $JSON
STATUS=$(echo "${JSON}" | jq -r ".projectStatus.status")
set +e
CONTAINS_FAILURE=$(echo "${OUTPUT}" | grep 'EXECUTION FAILURE')
set -e
if [[ $STATUS == 'ERROR' ]] || [[ $CONTAINS_FAILURE != '' ]] ; then
  echo "SonarQube Failed"
  exit 1;
fi