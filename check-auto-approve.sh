#!/bin/bash

files=()
files+=("./iam/terraform/environment-specific/bin/deploy-app.sh")
files+=("./web-api/terraform/bin/deploy-app.sh")
files+=("./web-api/workflow-terraform/migration/bin/deploy-app.sh")
files+=("./web-api/workflow-terraform/migration-cron/bin/deploy-app.sh")
files+=("./web-api/workflow-terraform/switch-colors-cron/bin/deploy-app.sh")
files+=("./web-api/workflow-terraform/reindex-cron/bin/deploy-app.sh")
files+=("./web-client/terraform/bin/deploy-app.sh")

for file in "${files[@]}"
do
  grep -q "terraform apply -auto-approve" "${file}"
  result=$?
  if [ ${result} -ne 0 ]; then
    echo "ERROR: ${file} does not contain the terraform apply -auto-approve command"
    exit 1
  fi
done
