#!/bin/bash -e
ENV=$1
REGION="us-east-1"
API_URL="https://efcms-${ENV}.${EFCMS_DOMAIN}"

CIRCLE_SHA1="${CIRCLE_SHA1}" SESSION_TIMEOUT=3300000 API_URL="${API_URL}" npm run build:public
