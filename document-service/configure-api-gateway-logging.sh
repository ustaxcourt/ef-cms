#!/bin/bash


function check_env_vars_exist() {
    echo "Checking appropriate environment variables are set."

    if [ -z "${ENVIRONMENT}" ] || [ -z "${REGION}" ]
    then
        echo "No ENVIRONMENT or REGION environment variable was specified."
        exit 1
    fi
}


function configure_custom_logging() {
    REST_API_ID=$(aws apigateway get-rest-apis --region="${REGION}" --query "items[?name=='${ENVIRONMENT}-ef-cms'].id" --output text)
    export REST_API_ID=$REST_API_ID
    aws apigateway update-stage \
        --rest-api-id "${REST_API_ID}" \
        --stage-name "${ENVIRONMENT}" \
        --region "${REGION}" \
        --patch-operations op=replace,path=/*/*/logging/dataTrace,value=true
}

check_env_vars_exist
configure_custom_logging