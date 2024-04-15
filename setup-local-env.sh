#!/bin/bash

export SKIP_VIRUS_SCAN=true
export AWS_ACCESS_KEY_ID=S3RVER
export AWS_SECRET_ACCESS_KEY=S3RVER
export AWS_REGION=us-east-1
export DYNAMODB_TABLE_NAME=efcms-local
export USER_LIMITER_THRESHOLD='5000'
export IP_LIMITER_THRESHOLD='5000'
export EFCMS_DOMAIN=localhost
export ELASTICSEARCH_HOST=localhost
export ELASTICSEARCH_ENDPOINT=http://localhost:9200
export IRS_SUPERUSER_EMAIL=irs-superuser@example.com
export USER_POOL_ID='local_2pHzece7'
export COGNITO_CLIENT_ID='bvjrggnd3co403c0aahscinne'
export DISABLE_EMAILS=true
export ENV=local
