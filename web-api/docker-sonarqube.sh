#!/bin/bash -e
branch_name="${branch_name}"
docker build -t api-sonarqube -f ../Dockerfile ..
docker run -e "SONAR_KEY=${SONAR_KEY}" -e "branch_name=${branch_name}" -e "SONAR_ORG=${SONAR_ORG}" -e "SONAR_TOKEN=${SONAR_TOKEN}" -v "$(pwd)/coverage:/home/app/web-api/coverage" --rm api-sonarqube /bin/sh -c 'cd web-api && ./verify-sonarqube-passed.sh'