#!/bin/bash -e

# shellcheck disable=SC1091
source "./scripts/helpers/suppress-output.sh"

{
  [[ -n $ZSH_VERSION && $ZSH_EVAL_CONTEXT =~ :file$ ]] ||
  [[ -n $BASH_VERSION ]] && (return 0 2>/dev/null);
} && sourced=1 || sourced=0
[[ $sourced -eq 0 ]] && exit="exit" || exit="return"

quiet=$(should_suppress_output "$@")

CHECK_PARAMS=("ENV" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY")
[[ "$quiet" -eq 1 ]] && CHECK_PARAMS+=("--quiet")

./check-env-variables.sh "${CHECK_PARAMS[@]}"
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  [[ "$quiet" -eq 0 ]] && echo "Aborted load-environment-from-secrets.sh"
  $exit $EXIT_CODE
fi

REGION=us-east-1
content=$(aws secretsmanager get-secret-value --region "${REGION}" --secret-id "${ENV}_deploy" --query "SecretString" --output text)
echo "${content}" | jq -r 'to_entries|map("\(.key)=\"\(.value)\"")|.[]' > .env
set -o allexport
source .env
set +o allexport
