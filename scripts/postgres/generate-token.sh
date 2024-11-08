#!/bin/bash -e

# Generates a temporary auth token for the given environment's RDS cluster

# Parameters
#   --rw          Generates a token for the writeable endpoint
#   --yes         Presumes prior confirmation when checking environment variables
#   --quiet       Exports values to environment variables and produces no output
#   --succinct    Outputs only the generated token (not compatible with --quiet)

# Usage examples
#   ./scripts/postgres/generate-token.sh
#   ./scripts/postgres/generate-token.sh --rw --succinct
#   DB_USER="${ENV}_dawson" ./scripts/postgres/generate-token.sh --rw

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1

{
  [[ -n "$ZSH_VERSION" && "$ZSH_EVAL_CONTEXT" =~ :file$ ]] ||
  [[ -n "$BASH_VERSION" ]] && (return 0 2>/dev/null);
} && sourced=1 || sourced=0
[[ "$sourced" -eq 0 ]] && exit="exit" || exit="return"

rw=0
succinct=0
sshhh=0
confirmed=0
for param in "$@"; do
  { [[ "$param" == "--rw" ]] || [[ "$param" == "-w" ]]; } && rw=1
  { [[ "$param" == "--succinct" ]] || [[ "$param" == "-t" ]]; } && succinct=1
  { [[ "$param" == "--quiet" ]] || [[ "$param" == "-q" ]]; } && sshhh=1
  { [[ "$param" == "--yes" ]] || [[ "$param" == "-y" ]]; } && confirmed=1
done

[[ "$sourced" -eq 0 ]] && [[ "$sshhh" -eq 1 ]] && $exit 1

CHECK_PARAMS=("ENV" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY")

{ [[ "$sshhh" -eq 1 ]] || [[ "$succinct" -eq 1 ]]; } && CHECK_PARAMS+=("--quiet")
[[ "$sshhh" -eq 0 ]] && [[ "$succinct" -eq 0 ]] && [[ "$confirmed" -eq 1 ]] && CHECK_PARAMS+=("--yes")

./check-env-variables.sh "${CHECK_PARAMS[@]}"

[[ "$rw" -eq 1 ]] && ENDPOINT="Endpoint" || ENDPOINT="ReaderEndpoint"

REGION="us-east-1"
DESCRIPTION=$(aws rds describe-db-clusters \
    --db-cluster-identifier "${ENV}-dawson-cluster" --region "$REGION" | jq -r ".DBClusters[0]")
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
    echo -e "\n\n############ Temporary postgres credentials ############\n"
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
