#!/bin/bash

# Disables a user in cognito by their DAWSON userId

# Usage
#   ./scripts/user/disable-cognito-user.sh 68686578-bc34-4aea-bc1d-25e505422843

# Arguments
#   - $1 - The userId of the user to disable

[ -z "$1" ] && echo "The user's DAWSON userId must be provided as the \$1 argument." && exit 1

USER_ID=$1

./check-env-variables.sh \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID" \
  "COGNITO_USER_POOL"

USER_COGNITO_ID=$(aws cognito-idp list-users --user-pool-id "$COGNITO_USER_POOL" \
    --filter "status = 'Enabled'" --attributes-to-get "custom:userId" \
    --query "Users[?contains(Attributes[].Value, '${USER_ID}')].Username | [0]" \
    | tr -d '"' \
)

[[ -z "$USER_COGNITO_ID" ]] && echo "No user found with the provided custom:userId" && exit 1

aws cognito-idp admin-disable-user --user-pool-id "$COGNITO_USER_POOL" --username "$USER_COGNITO_ID"
