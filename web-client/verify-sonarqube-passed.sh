FULL_URL="https://sonarcloud.io"
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
sonar-scanner-3.2.0.1227-macosx/bin/sonar-scanner -Dsonar.branch.name=${BRANCH_NAME} -Dsonar.organization=flexion-github -Dsonar.projectBaseDir=. -Dsonar.login=${SONAR_TOKEN} -Dsonar.host.url=$FULL_URL
sleep 5
PROJECT_KEY=$(grep sonar.projectKey sonar-project.properties | sed 's/sonar.projectKey=\(.*\)/\1/')
CURL_URL="$FULL_URL/api/qualitygates/project_status?projectKey=$PROJECT_KEY&branch=${BRANCH_NAME}"
JSON=$(curl -u admin:$SONAR_PASSWORD -X GET -H 'Accept: application/json' $CURL_URL)
STATUS=$(echo $JSON | jq -r ".projectStatus.status")
if [[ $STATUS == 'ERROR' ]] ; then
  echo "SonarQube Failed"
  exit 1;
fi