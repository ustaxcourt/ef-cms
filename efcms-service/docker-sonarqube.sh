#!/bin/bash -e
branch_name="${branch_name}"
docker build -t api-sonarqube -f ../Dockerfile.web-client ..
docker run -e "SONAR_KEY=${SONAR_KEY}" -e "branch_name=${branch_name}" -e "SONAR_ORG=${SONAR_ORG}" -e "SONAR_TOKEN=${SONAR_TOKEN}" -v "$(pwd)/coverage:/home/app/coverage" --rm api-sonarqube /bin/sh -c 'cd efcms-service && ./verify-sonarqube-passed.sh'