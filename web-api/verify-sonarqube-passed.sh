#!/bin/bash -e
FULL_URL="https://sonarcloud.io"
branch_name=$branch_name
OUTPUT=$(sonar-scanner -Dsonar.projectKey="${SONAR_KEY}" -Dsonar.branch.name="${branch_name}" -Dsonar.organization="${SONAR_ORG}" -Dsonar.projectBaseDir=. -Dsonar.login="${SONAR_TOKEN}" -Dsonar.host.url="${FULL_URL}")
echo "${OUTPUT}"
regex="(https:\/\/sonarcloud\.io\/api\/ce\/task\?id=[a-zA-Z0-9_-]+)"
if [[ $OUTPUT =~ $regex ]] ; then
  STATUS_URL="${BASH_REMATCH[1]}"
else
  exit 1;
fi

while true
do
  STATUS_JSON=$(curl -u "${SONAR_TOKEN}:" -X GET -H 'Accept: application/json' "${STATUS_URL}")
  STATUS=$(echo "${STATUS_JSON}" | jq -r ".task.status")
  echo ""
  echo "${STATUS_JSON}"
  echo "${STATUS}"
  echo ""
  if [ "$STATUS" != "IN_PROGRESS" ] && [ "$STATUS" != "PENDING" ] ; then
    break
  fi
  echo "$STATUS - sleeping"
  sleep 5
done

if [[ $STATUS != 'SUCCESS' ]] ; then
  echo "SonarQube Failed"
  exit 1;
fi