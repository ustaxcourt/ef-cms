#!/bin/bash -e

for param in "$@"; do
  if [[ "$param" == "--rw" ]]; then
    RW="--rw"
  else
    env="$param"
  fi
done

[[ -z "$env" ]] && [[ -n "$ENV" ]] && env="$ENV"
[[ -z "$env" ]] && exit 1

ROOT_DIR="$(readlink -f "$(dirname "$(readlink -f "$0")")/../..")"
pushd "$ROOT_DIR"

# shellcheck disable=SC1091
source "./scripts/env/set-env.zsh" --quiet "$env"
# shellcheck disable=SC1091
source "./scripts/postgres/generate-token.sh" --quiet "$RW"

popd

[[ -z "$DB_TOKEN" ]] && exit 1

echo "$DB_TOKEN"
