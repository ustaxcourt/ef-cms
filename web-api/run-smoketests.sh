#!/bin/bash -e
slsStage=$1
region=$2
restApiId=$(aws apigateway get-rest-apis --region="${region}" --query "items[?name=='${slsStage}-ef-cms'].id" --output text)
token=$(./aws-login.sh "${slsStage}")
mkdir -p coverage
STAGE="${slsStage}" DYNAMODB_ENDPOINT="dynamodb.${region}.amazonaws.com" AWS_REGION=${region} API_REGION=${region} API_STAGE=${slsStage} API_TARGET=${restApiId} DEBUG_FD=1 DEBUG=http:response ./node_modules/.bin/artillery run -v "{\"token\": \"$token\"}" ./smokeTest.yml --output ./coverage/artillery_smoke_test.json
./node_modules/.bin/artillery report -o ./coverage/smokeTestReport.html ./coverage/artillery_smoke_test.json
set +e
grep -v '"errors": {}' ./coverage/artillery_smoke_test.json | grep errors
exitCode="$?"
set -e
if [ $exitCode -eq 0 ]; then
  exit 1
fi
exit 0