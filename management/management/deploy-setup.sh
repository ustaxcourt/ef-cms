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
      echo "A script to automate the US Tax Court deployment process."
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
  ARG_OPTS="-auto-approve ${ARG_OPTS}"
fi

if [[ ! -e terraform.tfvars ]]; then
    echo "A custom terraform/terraform.tfvars file was not found.  Copying the template terraform/terraform.tfvars.template file for use in your local environment."
    echo "You should manage this file locally to customize the environment."
    cp terraform.tfvars.template terraform.tfvars
fi

if grep -q "CHANGEME_DEP_NAME" terraform.tfvars; then
  echo "Automatically generating an initial environment name"
  NEW_DEP=$(whoami)
  sed -i.bak -e "s/CHANGEME_DEP_NAME/${NEW_DEP}/" terraform.tfvars
  rm terraform.tfvars.bak
else
  echo "An existing environment name found in the terraform.tfvars file, not substituting."
fi

NAME_FOR_LENGTH=${DEPLOYMENT_NAME}-${ENVIRONMENT}

if [ ${#NAME_FOR_LENGTH} -ge 30 ]; then
      echo "The combined app name and environment from the terraform.tfvars file are too long [${NAME_FOR_LENGTH}].  They must be shorter than 30 characters when combined with a dash."
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

if [ -z "${EFCMS_DOMAIN}" ]
then
      echo "EFCMS_DOMAIN must be set in order for terraform to run, exiting"
      exit 1
fi

# check ssh prerequisites, including possibly symlinked files
if [ -z ${SKIP_KEYGEN} ]; then
  if [[ ! -e ssh/id_rsa.pub && ! -e ssh/id_rsa ]]; then
      echo "No ssh keypair was found.  One is being created."
      sh ../bin/generate-ssh-key.sh
  fi

  if [[ ! -e ssh/id_rsa.pub || ! -e ssh/id_rsa ]]; then
      echo "Both an ssh/id_rsa.pub public key and matching ssh/id_rsa private key must be provided to the provisioning process"
      exit 1
  fi

  echo "checking for the ${ENVIRONMENT}-${DEPLOYMENT_NAME}-management key pair in aws..."
  aws ec2 describe-key-pairs --output text | egrep "\t${ENVIRONMENT}-${DEPLOYMENT_NAME}-management$"
  result=$?
  if [ ${result} -ne 0 ]; then
    # upload the key
    aws ec2 import-key-pair --key-name "${ENVIRONMENT}-${DEPLOYMENT_NAME}-management" --public-key-material file://ssh/id_rsa.pub
  else
    echo "${ENVIRONMENT}-${DEPLOYMENT_NAME}-management ssh kiey pair already exists"
  fi
fi

BUCKET="${EFCMS_DOMAIN}.${DEPLOYMENT_NAME}.${ENVIRONMENT}.provisioning-resources"
KEY=common.tfstate
LOCK_TABLE=${DEPLOYMENT_NAME}-${ENVIRONMENT}-terraform-lock

REGION=$(egrep -e "^aws_region " terraform.tfvars | sed -e 's/.*=//' -e 's/"//g' -e 's/ //g' -e 's/#.*//g')
if [ -z "${REGION}" ]
then
      echo "A region could not be parsed from the terraform.tfvars file, exiting"
      exit 1
fi

# Add the current external address to the SSH CIDRS if there is a substitution placeholder
sh ../bin/add-local-external-address.sh


rm -rf .terraform
echo "Initiating provisioning for environment [${ENVIRONMENT}] in AWS region [${REGION}]"
sh ../bin/create-bucket.sh "${BUCKET}" "${KEY}" "${REGION}"

echo "checking for the dynamodb lock table..."
aws dynamodb list-tables --output text| grep ${LOCK_TABLE}
result=$?
if [ ${result} -ne 0 ]; then
  echo "dynamodb lock does not exist, creating"
  sh ../bin/create-dynamodb.sh "${LOCK_TABLE}" "${REGION}"
else
  echo "dynamodb lock table already exists"
fi

# exit on any failure
set -eo pipefail