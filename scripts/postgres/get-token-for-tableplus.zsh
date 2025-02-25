#!/bin/zsh

[[ "$#" -gt 2 ]] && echo "Unexpected parameter" && exit 1

for param in "$@"; do
  if [[ "$param" == "--rw" ]]; then
    RW="--rw"
  else
    env="$param"
  fi
done

[[ -z "$env" ]] && [[ -n "$ENV" ]] && env="$ENV"
[[ -z "$env" ]] && echo "Missing environment parameter" && exit 1

ROOT_DIR="$(readlink -f "$(dirname "$(readlink -f "$0")")/../..")"
cd "$ROOT_DIR" || { echo "Unable to switch to the ef-cms directory"; exit 1; }

# shellcheck disable=SC1091
source "./scripts/env/set-env.zsh" "$env" --quiet
source "./scripts/postgres/generate-token.sh" "$RW" --quiet

[[ -z "$DB_TOKEN" ]] && echo "Unable to generate IAM token" && exit 1

echo "$DB_TOKEN"
