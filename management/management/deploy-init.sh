#!/usr/bin/env bash

. ./deploy-setup.sh "$@"

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table=${LOCK_TABLE} -backend-config=region="${REGION}"