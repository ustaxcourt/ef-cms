#!/bin/bash -e
branch_name="${branch_name}"
docker build -t web-client-build -f ../Dockerfile.web-client ..
docker run -e "SONAR_KEY=${SONAR_KEY}" -e "branch_name=${branch_name}" -e "SONAR_ORG=${SONAR_ORG}" -e "SONAR_TOKEN=${SONAR_TOKEN}" -v "$(pwd)/coverage:/home/app/web-client/coverage" --rm web-client-build /bin/sh -c 'cd web-client && ./verify-sonarqube-passed.sh'