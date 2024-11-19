#!/bin/bash -e

# Returns the host endpoint for a given environment's RDS cluster

# Parameters
#   --rw          Returns the writeable endpoint
#   --yes         Presumes prior confirmation when checking environment variables
#   --quiet       Exports the value to environment variable $DB_HOST and produces no output
#   --succinct    Outputs only the host endpoint (not compatible with --quiet)

# Usage examples
#   ./scripts/postgres/get-host.sh
#   ./scripts/postgres/get-host.sh --rw --succinct

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1

{
  [[ -n "$ZSH_VERSION" && "$ZSH_EVAL_CONTEXT" =~ :file$ ]] ||
  [[ -n "$BASH_VERSION" ]] && (return 0 2>/dev/null);
} && sourced=1 || sourced=0
[[ "$sourced" -eq 0 ]] && exit="exit" || exit="return"

rw=0
[[ -n "$CI" ]] && succinct=1 || succinct=0
sshhh=0
confirmed=0
for param in "$@"; do
  { [[ "$param" == "--rw" ]] || [[ "$param" == "-w" ]]; } && rw=1
  { [[ "$param" == "--succinct" ]] || [[ "$param" == "-h" ]]; } && succinct=1
  { [[ "$param" == "--quiet" ]] || [[ "$param" == "-q" ]]; } && sshhh=1
  { [[ "$param" == "--yes" ]] || [[ "$param" == "-y" ]]; } && confirmed=1
done

[[ "$sourced" -eq 0 ]] && [[ "$sshhh" -eq 1 ]] && $exit 1

CHECK_PARAMS=("ENV" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY")

{ [[ "$sshhh" -eq 1 ]] || [[ "$succinct" -eq 1 ]]; } && CHECK_PARAMS+=("--quiet")
[[ "$sshhh" -eq 0 ]] && [[ "$succinct" -eq 0 ]] && [[ "$confirmed" -eq 1 ]] && CHECK_PARAMS+=("--yes")

./check-env-variables.sh "${CHECK_PARAMS[@]}"

[[ "$rw" -eq 1 ]] && ep="Endpoint" || ep="ReaderEndpoint"

ENDPOINT=$(aws rds describe-db-clusters \
    --db-cluster-identifier "${ENV}-dawson-cluster" --region us-east-1 | jq -r ".DBClusters[0].${ep}")

if [[ -z "$ENDPOINT" ]]; then
    [[ "$sshhh" -eq 0 ]] && echo -e "\nError: Unable to determine ${ep}."
    $exit 1
fi

# shellcheck disable=SC2015
[[ "$sshhh" -eq 0 ]] && echo "$ENDPOINT" || export DB_HOST="$ENDPOINT"
