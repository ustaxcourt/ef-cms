#!/bin/bash -e

files=()
files+=("./iam/terraform/environment-specific/bin/deploy-app.sh")
files+=("./web-api/migration-terraform/bin/deploy-app.sh")
files+=("./web-api/terraform/bin/deploy-app.sh")
files+=("./web-client/terraform/bin/deploy-app.sh")

for file in ${files[*]}
do
  echo $file
  cat $file | grep "terraform apply -auto-approve"
done