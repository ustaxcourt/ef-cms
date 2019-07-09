#!/bin/bash -e

# This runs the same build steps that run in Circle, except sonar
docker build -t efcms -f Dockerfile .
docker run --rm efcms /bin/sh -c 'cd shared && ./run-shellcheck.sh'
docker run --rm efcms /bin/sh -c 'cd shared && npm run lint'
docker run -v $(pwd)/shared/coverage:/home/app/shared/coverage --rm efcms /bin/sh -c 'cd shared && npm run test'
# docker run -v $(pwd)/shared/coverage:/home/app/shared/coverage -e "SONAR_KEY=${SHARED_SONAR_KEY}" -e "branch_name=${CIRCLE_BRANCH}" -e "SONAR_ORG=${SONAR_ORG}" -e "SONAR_TOKEN=${SHARED_SONAR_TOKEN}" --rm efcms /bin/sh -c 'cd shared && ./verify-sonarqube-passed.sh'
docker run --rm efcms /bin/sh -c 'cd web-api && ./run-shellcheck.sh'
docker run --rm efcms /bin/sh -c 'cd web-api && npm run lint'
docker run -v $(pwd)/web-api/coverage:/home/app/web-api/coverage --rm efcms /bin/sh -c 'cd web-api && npm run test'
# docker run -v $(pwd)/web-api/coverage:/home/app/web-api/coverage -e "SONAR_KEY=${API_SONAR_KEY}" -e "branch_name=${CIRCLE_BRANCH}" -e "SONAR_ORG=${SONAR_ORG}" -e "SONAR_TOKEN=${API_SONAR_TOKEN}" --rm efcms /bin/sh -c 'cd web-api && ./verify-sonarqube-passed.sh'
docker run --rm efcms /bin/sh -c 'cd web-client && ./run-shellcheck.sh'
docker run --rm efcms /bin/sh -c 'cd web-client && npm run lint'
docker run -v $(pwd)/web-client/coverage:/home/app/web-client/coverage-unit --rm efcms /bin/sh -c 'cd web-client && npm run test:unit'
# docker run -v $(pwd)/web-client/coverage:/home/app/web-client/coverage -e "SONAR_KEY=${UI_SONAR_KEY}" -e "branch_name=${CIRCLE_BRANCH}" -e "SONAR_ORG=${SONAR_ORG}" -e "SONAR_TOKEN=${UI_SONAR_TOKEN}" --rm efcms /bin/sh -c 'cd web-client && ./verify-sonarqube-passed.sh'
docker run --rm -e AWS_ACCESS_KEY_ID=noop -e AWS_SECRET_ACCESS_KEY=noop efcms /bin/sh -c 'cd web-api && npm run install:dynamodb && (npm start &) && ../wait-until.sh http://localhost:3000/swagger && cd ../web-client && (npm run dev &) && ../wait-until.sh http://localhost:1234 && npm run test:pa11y'
docker run --rm -e AWS_ACCESS_KEY_ID=noop -e AWS_SECRET_ACCESS_KEY=noop efcms /bin/sh -c "cd web-api && npm run install:dynamodb && (npm start &) && ../wait-until.sh http://localhost:3000/swagger && cd ../web-client && npm run test"
docker run --rm -e SLS_DEBUG=* -e AWS_ACCESS_KEY_ID=noop -e AWS_SECRET_ACCESS_KEY=noop efcms /bin/sh -c 'cd web-api && npm run install:dynamodb && (npm start &) && ../wait-until.sh http://localhost:3000/swagger && cd ../web-client && (npm run dev:cypress &) && ../wait-until.sh http://localhost:1234 && npm run cypress'
