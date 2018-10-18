#!/usr/bin/env bash
set -eo pipefail

function check_env_vars_exist() {
    echo "Checking appropriate environment variables are set."

    if [[ -z "${ENVIRONMENT}" ]]
    then
        echo "No ENVIRONMENT environment variable was specified."
        exit 1
    fi
}


function prepare_serverless() {
    echo "Preparing to run Serverless."

    pushd ./src/
    rm -rf ./node_modules/
    npm install
    popd

    rm -rf ./node_modules/
    npm install
}

function run_development() {

    if [[ "${ENVIRONMENT}" == "dev" ]] || [[ "${ENVIRONMENT}" == "staging" ]] || [[ "${ENVIRONMENT}" == "prod" ]]; then
        echo "Cannot use this script to deploy to dev, staging or prod."
        exit 1
    fi

    echo "Running dev contributor setup in AWS for ${ENVIRONMENT}"
    echo
    export SLS_STAGE=${ENVIRONMENT}

    pushd ./terraform/dev/
    terraform init
    export SLS_DEPLOYMENT_BUCKET=$(terraform output sls_deployment_bucket)
    popd

    echo "running serverless deploy --stage ${SLS_STAGE}"

    sls deploy --stage ${SLS_STAGE}
}

function configure_custom_logging() {
    export REST_API_ID=$(aws apigateway get-rest-apis --query "items[?name=='${ENVIRONMENT}-example-service'].id" --output text)
    aws apigateway update-stage \
        --rest-api-id "${REST_API_ID}" \
        --stage-name "${ENVIRONMENT}" \
        --region us-east-1 \
        --patch-operations op=replace,path=/*/*/logging/dataTrace,value=true
}

check_env_vars_exist
prepare_serverless
run_development
configure_custom_logging
