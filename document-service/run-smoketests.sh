#!/bin/bash
slsStage=$1
region=$2
restApiId=$(aws apigateway get-rest-apis --region="${region}" --query "items[?name=='${slsStage}-ef-cms'].id" --output text)
mkdir -p coverage
API_REGION=${region} API_STAGE=${slsStage} API_TARGET=${restApiId} ./node_modules/.bin/artillery run ./smokeTest.yml --output ./coverage/artillery_smoke_test.json
./node_modules/.bin/artillery report -o ./coverage/smokeTestReport.html ./coverage/artillery_smoke_test.json