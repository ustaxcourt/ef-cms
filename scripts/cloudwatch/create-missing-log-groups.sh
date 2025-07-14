#!/bin/bash

# Log groups subscribed to by Terraform are deployed per environment,
# and may not exist at the time of running the account-specific Terraform
# step. This script will create any missing log groups, so they can be
# subscribed to.

set -e

ENV=$1

[ -z "${ENV}" ] && echo "You must pass in ENV as command line argument 1" && exit 1

export AWS_PAGER="" # Don’t show `less` on AWS CLI responses

echo "Retrieving log groups…"

EAST_GROUPS=$(aws logs describe-log-groups --region="us-east-1" --log-group-name-prefix="/aws/" --query="logGroups[].logGroupName" --output=text)

EAST_GROUPS_TO_CREATE=()
EAST_EXISTING_GROUPS=()
process_group () {
  local GROUP=$1

  if [[ $EAST_GROUPS =~ (^|[[:space:]])$GROUP($|[[:space:]]) ]]; then
    EAST_EXISTING_GROUPS+=("$GROUP")
  else
    EAST_GROUPS_TO_CREATE+=("$GROUP")
  fi
}

echo
echo "Checking for expected log groups…"

for COLOR in blue green; do
  process_group "/aws/lambda/api_${ENV}_${COLOR}"
  process_group "/aws/lambda/api_public_${ENV}_${COLOR}"
  process_group "/aws/lambda/api_async_${ENV}_${COLOR}"
  process_group "/aws/lambda/streams_${ENV}_${COLOR}"
  process_group "/aws/apigateway/gateway_api_${ENV}_${COLOR}"
  process_group "/aws/apigateway/gateway_api_public_${ENV}_${COLOR}"
  process_group "/aws/lambda/websockets_connect_${ENV}_${COLOR}"
  process_group "/aws/lambda/websockets_disconnect_${ENV}_${COLOR}"
  process_group "/aws/lambda/send_emails_${ENV}_${COLOR}"
  process_group "/aws/lambda/set_trial_session_${ENV}_${COLOR}"
done
process_group "/aws/lambda/migration_segments_lambda_${ENV}"
process_group "/aws/lambda/cognito_authorizer_lambda_${ENV}"

echo
echo "${#EAST_EXISTING_GROUPS[@]} (us-east-1) group already exist."
echo

TOTAL_TO_ADD="${#EAST_GROUPS_TO_CREATE[@]}"

if [[ "$TOTAL_TO_ADD" == "0" ]]; then
  echo "No other log groups to create. Exiting!"
  exit 0
fi

echo "These ${TOTAL_TO_ADD} log groups are missing:"
for GROUP in "${EAST_GROUPS_TO_CREATE[@]}"; do
  echo "  - $GROUP (us-east-1)"
done

echo
read -p "Create these log groups? (y/N) " -r
[[ ! $REPLY =~ ^[Yy]$ ]] && echo "Exiting." && exit 1

echo
set -x

for GROUP in "${EAST_GROUPS_TO_CREATE[@]}"; do
  aws logs create-log-group --log-group-name="$GROUP" --region="us-east-1"
done
