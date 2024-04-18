#!/bin/bash -e

../../check-env-variables.sh "ENV"

aws events enable-rule --name "wait_for_workflow_cron_${ENV}" --region us-east-1
