#!/bin/bash
set -eo pipefail

function check_env_vars_exist() {
    echo "Checking appropriate environment variables are set."

    if [[ -z "${ENVIRONMENT}" ]]
    then
        echo "No ENVIRONMENT environment variable was specified."
        exit 1
    fi

    if [[ -z "${REGION}" ]]
    then
        echo "No REGION environment variable was specified."
        exit 1
    fi

    if [[ -z "${EFCMS_DOMAIN}" ]]
    then
        echo "No EFCMS_DOMAIN environment variable was specified."
        exit 2
    fi

    if [[ -z "${COGNITO_SUFFIX}" ]]
    then
        echo "No COGNITO_SUFFIX environment variable was specified."
        exit 2
    fi
}


function prepare_serverless() {
    echo "Preparing to run Serverless."
    export NODE_PRESERVE_SYMLINKS=1
    rm -rf ./node_modules/
    rm package-lock.json || true
    pushd ../shared
    rm -rf ./node_modules/
    rm package-lock.json || true
    npm install --production
    popd
    npm i
}

function run_development() {

    if [[ "${ENVIRONMENT}" == "dev" ]] || [[ "${ENVIRONMENT}" == "staging" ]] || [[ "${ENVIRONMENT}" == "prod" ]]; then
        echo "Cannot use this script to deploy to dev, staging or prod."
        exit 1
    fi

    echo "Running dev contributor setup in AWS for ${ENVIRONMENT}"
    echo
    export SLS_STAGE=${ENVIRONMENT}

    pushd ./terraform/main/
    ../bin/deploy-app.sh "${ENVIRONMENT}"
    SLS_DEPLOYMENT_BUCKET=$(terraform output sls_deployment_bucket)
    export SLS_DEPLOYMENT_BUCKET=$SLS_DEPLOYMENT_BUCKET
    popd

    echo "running serverless deploy --stage ${SLS_STAGE} --region ${REGION} --domain ${EFCMS_DOMAIN}"
    ./run-serverless.sh "${SLS_STAGE}" "${REGION}" "${ACCOUNT_ID}"
}

check_env_vars_exist
prepare_serverless
run_development
