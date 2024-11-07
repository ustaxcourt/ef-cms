#!/bin/bash -e

# Generates a temporary auth token for the given environment's RDS cluster

# Parameters
#   --rw          Generates a token for the writeable endpoint
#   --yes         Presumes prior confirmation when checking environment variables
#   --quiet       Exports values to environment variables and produces no output
#   --succinct    Outputs only the generated token (not compatible with --quiet)

# Usage examples
#   ENV=dev ./scripts/postgres/generate-token.sh
#   ENV=dev ./scripts/postgres/generate-token.sh --rw --succinct
#   ENV=dev DB_USER=test_dawson ./scripts/postgres/generate-token.sh --rw

# shellcheck disable=SC1091
source "./scripts/helpers/suppress-output.sh"
# shellcheck disable=SC1091
source "./scripts/helpers/prior-confirmation.sh"

{
  [[ -n $ZSH_VERSION && $ZSH_EVAL_CONTEXT =~ :file$ ]] ||
  [[ -n $BASH_VERSION ]] && (return 0 2>/dev/null);
} && sourced=1 || sourced=0
[[ $sourced -eq 0 ]] && exit="exit" || exit="return"

succinct=0
for param in "$@"; do
  if [[ "$param" == "--rw" ]]; then
    RW=1
  fi
  if [[ "$param" == "--succinct" ]]; then
    succinct=1
  fi
done

sshhh=$(should_suppress_output "$@")
{ [[ "$sshhh" -eq 1 ]] || [[ "$succinct" -eq 1 ]]; } && QUIET="--quiet"

confirmed=$(has_prior_confirmation "$@")
[[ "$sshhh" -eq 0 ]] && [[ "$succinct" -eq 0 ]] && [[ "$confirmed" -eq 1 ]] && YES="--yes"

./check-env-variables.sh "${QUIET}${YES}" \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

[[ "$RW" -eq 1 ]] && ENDPOINT="Endpoint" || ENDPOINT="ReaderEndpoint"

DESCRIPTION=$(aws rds describe-db-clusters --db-cluster-identifier "${ENV}-dawson-cluster" | jq -r ".DBClusters[0]")
REGION="us-east-1"
DB_HOST=$(jq -r ".${ENDPOINT}" <<< "$DESCRIPTION")
DB_PORT=$(jq -r ".Port" <<< "$DESCRIPTION")
[[ -z "$DB_USER" ]] && DB_USER="${ENV}_developers"
DB_NAME="${ENV}_dawson"

TOKEN=$(aws rds generate-db-auth-token \
    --hostname "$DB_HOST" \
    --port "$DB_PORT" \
    --region "$REGION" \
    --username "$DB_USER")

if [[ -z "$TOKEN" ]]; then
    [[ "$sshhh" -eq 0 ]] && echo -e "\nError: Failed to generate IAM token."
    $exit 1
fi

if [[ "$sshhh" -eq 0 ]]; then
  if [[ "$succinct" -eq 1 ]]; then
    echo "$TOKEN"
  else
    echo -e "\n"
    echo -e "############ Temporary postgres credentials ############\n"
    echo "Host/Socket:"
    echo -e "${DB_HOST}\n"
    echo "Port:"
    echo -e "${DB_PORT}\n"
    echo "User:"
    echo -e "${DB_USER}\n"
    echo "Password:"
    echo -e "${TOKEN}\n"
    echo "Database:"
    echo -e "${DB_NAME}\n"
  fi
else
  export DB_HOST="$DB_HOST"
  export DB_PORT="$DB_PORT"
  export DB_USER="$DB_USER"
  export DB_TOKEN="$TOKEN"
  export DB_NAME="$DB_NAME"
fi
