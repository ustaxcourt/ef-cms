#!/bin/bash -e

FULL_URL="https://sonarcloud.io"
branch_name=$branch_name
OUTPUT=$(sonar-scanner -Dsonar.projectKey="${SONAR_KEY}" -Dsonar.branch.name="${branch_name}" -Dsonar.organization="${SONAR_ORG}" -Dsonar.projectBaseDir=. -Dsonar.login="${SONAR_TOKEN}" -Dsonar.host.url="${FULL_URL}")
echo "$OUTPUT"
sleep 10
PROJECT_KEY=$(grep sonar.projectKey sonar-project.properties | sed 's/sonar.projectKey=\(.*\)/\1/')
CURL_URL="${FULL_URL}/api/qualitygates/project_status?projectKey=${PROJECT_KEY}&branch=${branch_name}"
JSON=$(curl -u "admin:${SONAR_PASSWORD}" -X GET -H 'Accept: application/json' "${CURL_URL}")
STATUS=$(echo "${JSON}" | jq -r ".projectStatus.status")
CONTAINS_FAILURE=$(echo "${OUTPUT}" | grep 'EXECUTION FAILURE')
if [[ $STATUS == 'ERROR' ]] || [[ $CONTAINS_FAILURE != '' ]] ; then
  echo "SonarQube Failed"
  exit 1;
fi