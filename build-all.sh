#!/bin/bash -e 
# TODO: Enable sonarqube / cloud related tasks ....

#if [ -z ${SHARED_SONAR_KEY+x} ]; then echo "SHARED_SONAR_KEY must be set to run build-all.sh"; exit 1; fi
#if [ -z ${SONAR_ORG+x} ]; then echo "SONAR_ORG must be set to run build-all.sh"; exit 1; fi
#if [ -z ${SHARED_SONAR_TOKEN+x} ]; then echo "SHARED_SONAR_TOKEN must be set to run build-all.sh"; exit 1; fi
#if [ -z ${API_SONAR_TOKEN+x} ]; then echo "API_SONAR_TOKEN must be set to run build-all.sh"; exit 1; fi
#if [ -z ${UI_SONAR_TOKEN+x} ]; then echo "UI_SONAR_TOKEN must be set to run build-all.sh"; exit 1; fi

./docker-init.sh

# shared
pushd shared
./docker-init.sh
./docker-shellcheck.sh
./docker-audit.sh
./docker-lint.sh
CONTAINER_NAME=shared-test ./docker-test.sh
#SONAR_KEY=${SHARED_SONAR_KEY} branch_name=local SONAR_ORG=${SONAR_ORG} SONAR_TOKEN=${SHARED_SONAR_TOKEN} ./docker-sonarqube.sh
popd

# web-client
pushd web-client
./docker-init.sh
./docker-shellcheck.sh
./docker-audit.sh
./docker-lint.sh
#sh "SONAR_KEY=${UI_SONAR_KEY} branch_name=${branch_name} SONAR_ORG=${SONAR_ORG} SONAR_TOKEN=${UI_SONAR_TOKEN} ./docker-sonarqube.sh"
popd

# efcms-service
pushd efcms-service
./docker-init.sh
./docker-shellcheck.sh
./docker-audit.sh
./docker-lint.sh
CONTAINER_NAME=efcmstest ./docker-test.sh
#SONAR_KEY=${API_SONAR_KEY} branch_name=${branch_name} SONAR_ORG=${SONAR_ORG} SONAR_TOKEN=${API_SONAR_TOKEN} ./docker-sonarqube.sh
popd

# integration tests
./docker-pa11y.sh
./docker-cerebral.sh
CONTAINER_NAME=cypress ./docker-cypress.sh