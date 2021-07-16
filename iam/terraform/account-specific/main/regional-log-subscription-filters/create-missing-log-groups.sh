#!/bin/bash

# Log groups subscribed to by Terraform are deployed per environment,
# and may not exist at the time of running the account-specific Terraform
# step. This script will create any missing log groups, so they can be
# subscribed to.

set -e

ENVIRONMENTS=$@
if [[ -z "${ENVIRONMENTS}" ]]; then
  echo "Pass environment list as space-separated arguments."
  echo
  echo "Example: "
  echo "  ./create-missing-log-groups.sh dev stg"
  exit 1
fi

export AWS_PAGER="" # Don’t show `less` on AWS CLI responses

echo "Retrieving log groups…"

EAST_GROUPS=$(aws logs describe-log-groups --region="us-east-1" --log-group-name-prefix="/aws/" --query="logGroups[].logGroupName" --output=text)
WEST_GROUPS=$(aws logs describe-log-groups --region="us-west-1" --log-group-name-prefix="/aws/" --query="logGroups[].logGroupName" --output=text)

EAST_GROUPS_TO_CREATE=()
EAST_EXISTING_GROUPS=()
WEST_GROUPS_TO_CREATE=()
WEST_EXISTING_GROUPS=()
process_group () {
  local GROUP=$1

  if [[ $EAST_GROUPS =~ (^|[[:space:]])$GROUP($|[[:space:]]) ]]; then
    EAST_EXISTING_GROUPS+=("$GROUP")
  else
    EAST_GROUPS_TO_CREATE+=("$GROUP")
  fi

  if [[ $WEST_GROUPS =~ (^|[[:space:]])$GROUP($|[[:space:]]) ]]; then
    WEST_EXISTING_GROUPS+=("$GROUP")
  else
    WEST_GROUPS_TO_CREATE+=("$GROUP")
  fi
}

echo
echo "Checking for expected log groups…"

for ENV in $ENVIRONMENTS; do
  for COLOR in blue green; do
    process_group "/aws/lambda/api_${ENV}_${COLOR}"
    process_group "/aws/lambda/api_public_${ENV}_${COLOR}"
    process_group "/aws/lambda/api_async_${ENV}_${COLOR}"
    process_group "/aws/lambda/streams_${ENV}_${COLOR}"
    process_group "/aws/lambda/migration_segments_lambda_${ENV}"
    process_group "/aws/apigateway/gateway_api_${ENV}_${COLOR}"
    process_group "/aws/apigateway/gateway_api_public_${ENV}_${COLOR}"
    process_group "/aws/lambda/websockets_connect_${ENV}_${COLOR}"
    process_group "/aws/lambda/websockets_disconnect_${ENV}_${COLOR}"
  done

  process_group "/aws/lambda/cognito_post_confirmation_lambda_${ENV}"
  process_group "/aws/ecs/clamav_fargate_${ENV}"
  process_group "/aws/lambda/cognito_post_authentication_lambda_${ENV}"
  process_group "/aws/lambda/legacy_documents_migration_lambda_${ENV}"
done

echo
echo "${#EAST_EXISTING_GROUPS[@]} (us-east-1) and ${#WEST_EXISTING_GROUPS[@]} (us-west-1) groups already exist."
echo

TOTAL_TO_ADD=$((${#EAST_GROUPS_TO_CREATE[@]} + ${#WEST_GROUPS_TO_CREATE[@]}))

if [[ "$TOTAL_TO_ADD" == "0" ]]; then
  echo "No other log groups to create. Exiting!"
  exit 0
fi

echo "These ${TOTAL_TO_ADD} log groups are missing:"
for GROUP in ${EAST_GROUPS_TO_CREATE[@]}; do
  echo "  - $GROUP (us-east-1)"
done

for GROUP in ${WEST_GROUPS_TO_CREATE[@]}; do
  echo "  - $GROUP (us-west-1)"
done

echo
read -p "Create these log groups? (y/N) " -r
[[ ! $REPLY =~ ^[Yy]$ ]] && echo "Exiting." && exit 1

echo
set -x

for GROUP in ${EAST_GROUPS_TO_CREATE[@]}; do
  aws logs create-log-group --log-group-name="$GROUP" --region="us-east-1"
done

for GROUP in ${WEST_GROUPS_TO_CREATE[@]}; do
  aws logs create-log-group --log-group-name="$GROUP" --region="us-west-1"
done
