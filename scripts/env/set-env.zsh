#!/bin/zsh

source "./scripts/env/unset-env.zsh"
source "./scripts/env/defaults"

env="${1:-$DEFAULT_ENV}"

# friendly aliases
DEVGLOB="develop development"
if [[ $DEVGLOB =~ (^|[[:space:]])$env($|[[:space:]]) ]]; then
  env="dev"
fi
if [[ $env == "staging" ]]; then
  env="stg"
fi
if [[ $env == "production" ]]; then
  env="prod"
fi
if [[ $env == "common" ]]; then
  env="local"
fi

# does the specified env include the org?
if [[ $env == *"-"* || $env == "local" ]]; then
  environment="$env"
else
  environment="${DEFAULT_ORG}-${env}"
fi

# load zsh colors
autoload -Uz colors
colors

# shellcheck disable=SC2154
if [[ ! -f "./scripts/env/environments/${environment}.env" ]]; then
  echo "${fg_bold[red]}Environment configuration not found for $reset_color${fg_bold[default]}${environment}$reset_color"
  return 1
fi

# shellcheck disable=SC1090
source "./scripts/env/environments/${environment}.env"

if [[ $environment != "local" ]]; then
  source "./scripts/env/environments/00-common"

  echo "  ___   ___      _____  ___  _  _ ";
  echo " |   \ /_\ \    / / __|/ _ \| \| |";
  echo " | |) / _ \ \/\/ /\__ \ (_) | .\` |";
  echo " |___/_/ \_\_/\_/ |___/\___/|_|\_|";
  echo "                                  ";
  echo "         env:   $fg_bold[default]${DAWSON_ENV}$reset_color"
  echo "         color: $fg_bold[${CURRENT_COLOR}]${CURRENT_COLOR}$reset_color"
  echo -e "         table: $fg_bold[default]${SOURCE_TABLE}$reset_color\n"
fi
