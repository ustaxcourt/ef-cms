#!/usr/bin/env bash

AUTO=false
ARG_OPTS=""
# use the bash builtin getops for robust option parsing
while getopts ":ha" opt; do
  case ${opt} in
    a )
      AUTO=true
      ;;
    h )
      echo "A script to automate the CMS QPP Foundational Components deployment process."
      echo "NOTE: This script initiates processes that are potentially destructive and cannot be undone."
      echo ""
      echo "Usage:"
      echo "  $0 [-s]"
      echo "  $0                   Run the complete infrastructure deployment process."
      echo "  $0 -h                Display this help message"
      echo "  $0 -a                Run the process automatically, without prompting for input."
      exit 0
      ;;
  esac
done

echo "Beginning the automated infrastructure deployment process"

if [ "${AUTO}" = "true" ]; then
  echo "Running without end user prompts"
  ARG_OPTS="-auto-approve=true ${ARG_OPTS}"
fi

if [[ ! -e terraform.tfvars ]]; then
    echo "A custom terraform/terraform.tfvars file was not found.  Copying the template terraform/terraform.tfvars.template file for use in your local environment."
    echo "You should manage this file locally to customize the environment."
    cp terraform.tfvars.template terraform.tfvars
fi

REGION=$(egrep -e "^aws_region " terraform.tfvars | sed -e 's/.*=//' -e 's/"//g' -e 's/ //g' -e 's/#.*//g')
if [ -z "${REGION}" ]
then
      echo "A region could not be parsed from the terraform.tfvars file, exiting"
      exit 1
fi

if grep --quiet "CHANGEME_DEP_NAME" terraform.tfvars; then
  echo "Automatically generating an initial environment name"
  NEW_DEP=$(whoami)
  sed -i.bak -e "s/CHANGEME_DEP_NAME/${NEW_DEP}/" terraform.tfvars
  rm terraform.tfvars.bak
else
  echo "An existing environment name found in the terraform.tfvars file, not substituting."
fi

DNS_NAME=$(egrep -e "^dns_domain " terraform.tfvars | sed -e 's/.*=//' -e 's/"//g' -e 's/ //g' -e 's/#.*//g')
if [ -z "${DNS_NAME}" ]
then
      echo "A dns domain could not be parsed from the terraform.tfvars file, exiting"
      exit 1
fi

ENVIRONMENT=$(egrep -e "^environment " terraform.tfvars | sed -e 's/.*=//' -e 's/"//g' -e 's/ //g' -e 's/#.*//g')
if [ -z "${ENVIRONMENT}" ]
then
      echo "An environment could not be parsed from the terraform.tfvars file, exiting"
      exit 1
fi

DEPLOYMENT_NAME=$(egrep -e "^deployment " terraform.tfvars | sed -e 's/.*=//' -e 's/"//g' -e 's/ //g' -e 's/#.*//g')
if [ -z "${DEPLOYMENT_NAME}" ]
then
      echo "A deployment name could not be parsed from the terraform.tfvars file, exiting"
      exit 1
fi

NAME_FOR_LENGTH=${DEPLOYMENT_NAME}-${ENVIRONMENT}

if [ ${#NAME_FOR_LENGTH} -ge 30 ]; then
      echo "The combined app name and environment from the terraform.tfvars file are too long [${NAME_FOR_LENGTH}].  They must be shorter than 30 characters when combined with a dash."
      exit 1
fi

BUCKET=${DEPLOYMENT_NAME}.${ENVIRONMENT}.provisioning-resources
KEY=common.tfstate
LOCK_TABLE=${DEPLOYMENT_NAME}-${ENVIRONMENT}-terraform-lock

rm -rf .terraform
echo "Initiating provisioning for environment [${ENVIRONMENT}] in AWS region [${REGION}]"
sh ../bin/create-bucket.sh "${BUCKET}" "${KEY}" "${REGION}"

echo "checking for the dynamodb lock table..."
aws dynamodb list-tables --output text --region ${REGION} | grep ${LOCK_TABLE}
result=$?
if [ ${result} -ne 0 ]; then
  echo "dynamodb lock does not exist, creating"
  sh ../bin/create-dynamodb.sh "${LOCK_TABLE}" "${REGION}"
else
  echo "dynamodb lock table already exists"
fi

# exit on any failure
set -eo pipefail

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table=${LOCK_TABLE} -backend-config=region="${REGION}"
TF_VAR_my_s3_state_bucket=${BUCKET} TF_VAR_my_s3_state_key=${KEY} terraform apply ${ARG_OPTS}