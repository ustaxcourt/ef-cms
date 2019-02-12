#!/bin/bash -e
ENV=$1
REGION="us-east-1"
API_URL="https://efcms-${ENV}.${EFCMS_DOMAIN}/v1"
COGNITO_REDIRECT_URL="https%3A//ui-${ENV}.${EFCMS_DOMAIN}/log-in"

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}")
CLIENT_ID="${CLIENT_ID%\"}"
CLIENT_ID="${CLIENT_ID#\"}"

COGNITO_LOGIN_URL="https://auth-${ENV}-${COGNITO_SUFFIX}.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${COGNITO_REDIRECT_URL}"

docker build -t web-client-build -f ../Dockerfile.web-client ..
docker run -e "API_URL=${API_URL}" -e "COGNITO_LOGIN_URL=${COGNITO_LOGIN_URL}" --name "${CONTAINER_NAME}" web-client-build /bin/sh -c "cd web-client && npm run dist"
CODE="$?"
docker cp "${CONTAINER_NAME}:/home/app/web-client/dist" dist
docker rm "${CONTAINER_NAME}"
exit "${CODE}"