#!/bin/bash -e

source "./scripts/helpers/suppress-output.sh"

{
  [[ -n $ZSH_VERSION && $ZSH_EVAL_CONTEXT =~ :file$ ]] ||
  [[ -n $BASH_VERSION ]] && (return 0 2>/dev/null);
} && sourced=1 || sourced=0

if [[ $sourced -eq 0 ]]; then
    exit="exit"
else
    exit="return"
fi

quiet=$(should_suppress_output "$@")
[[ "$quiet" -eq 1 ]] && QUIET=" --quiet"

"./check-env-variables.sh${QUIET}" \
    "ENV" \
    "AWS_SECRET_ACCESS_KEY" \
    "AWS_ACCESS_KEY_ID"
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  if [[ "$quiet" -eq 0 ]]; then
    echo "Aborted load-environment-from-secrets.sh"
  fi
  $exit $EXIT_CODE
fi

REGION=us-east-1
content=$(aws secretsmanager get-secret-value --region "${REGION}" --secret-id "${ENV}_deploy" --query "SecretString" --output text)
echo "${content}" | jq -r 'to_entries|map("\(.key)=\"\(.value)\"")|.[]' > .env
set -o allexport
# shellcheck disable=SC1091
source .env
set +o allexport
