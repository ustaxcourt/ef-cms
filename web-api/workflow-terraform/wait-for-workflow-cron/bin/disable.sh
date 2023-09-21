#!/bin/bash

./check-env-variables.sh "ENV"

aws events disable-rule --name "wait_for_workflow_cron_${ENV}" --region us-east-1
