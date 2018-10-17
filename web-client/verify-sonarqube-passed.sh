SONAR_URL=$(cd ../management/management && terraform output sonarqube_url)
FULL_URL="https://$SONAR_URL"
sonar-scanner -Dsonar.projectBaseDir=. -Dsonar.login=admin -Dsonar.password=$SONAR_PASSWORD -Dsonar.host.url=$FULL_URL
sleep 5
PROJECT_KEY=$(grep sonar.projectKey sonar-project.properties | sed 's/sonar.projectKey=\(.*\)/\1/')
CURL_URL="$FULL_URL/api/qualitygates/project_status?projectKey=$PROJECT_KEY"
JSON=$(curl -u admin:$SONAR_PASSWORD -X GET -H 'Accept: application/json' $CURL_URL)
STATUS=$(echo $JSON | jq -r ".projectStatus.status")
if [[ $STATUS == 'ERROR' ]] ; then
  echo "SonarQube Failed"
  exit 1;
fi