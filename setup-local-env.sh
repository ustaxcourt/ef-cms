#!/bin/bash

export IS_LOCAL=true
export SKIP_VIRUS_SCAN=true
export AWS_ACCESS_KEY_ID=S3RVER
export AWS_SECRET_ACCESS_KEY=S3RVER
export SLS_DEPLOYMENT_BUCKET=S3RVER
export S3_ENDPOINT=http://0.0.0.0:9000
export DOCUMENTS_BUCKET_NAME=noop-documents-local-us-east-1
export TEMP_DOCUMENTS_BUCKET_NAME=noop-temp-documents-local-us-east-1
export QUARANTINE_BUCKET_NAME=noop-quarantine-local-us-east-1
export AWS_REGION=us-east-1
export DYNAMODB_TABLE_NAME=efcms-local
export USER_LIMITER_THRESHOLD='5000'
export IP_LIMITER_THRESHOLD='5000'
export EFCMS_DOMAIN=localhost
export ELASTICSEARCH_HOST=localhost
export ELASTICSEARCH_ENDPOINT=http://localhost:9200
export DYNAMODB_ENDPOINT=http://localhost:8000
export IRS_SUPERUSER_EMAIL=irs-superuser@example.com
