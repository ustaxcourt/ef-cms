#!/bin/bash

export CI=true
export SKIP_VIRUS_SCAN=true
export AWS_ACCESS_KEY_ID=S3RVER
export AWS_SECRET_ACCESS_KEY=S3RVER
export SLS_DEPLOYMENT_BUCKET=S3RVER
export MASTER_DYNAMODB_ENDPOINT=http://localhost:8000
export S3_ENDPOINT=http://localhost:9000
export DOCUMENTS_BUCKET_NAME=noop-documents-local-us-east-1
export TEMP_DOCUMENTS_BUCKET_NAME=noop-temp-documents-local-us-east-1
export QUARANTINE_BUCKET_NAME=noop-quarantine-local-us-east-1
export AWS_REGION=us-east-1
export DYNAMODB_TABLE_NAME=efcms-local
