#!/bin/zsh

source "./scripts/env/unset-env.zsh"
source "./scripts/env/defaults"
source "./scripts/helpers/suppress-output.sh"

env="${1:-$DEFAULT_ENV}"
quiet=$(should_suppress_output "$@")

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

if [[ $quiet -eq 0 ]]; then
# load zsh colors
  autoload -Uz colors
  colors
fi

# shellcheck disable=SC2154
if [[ ! -f "./scripts/env/environments/${environment}.env" ]]; then
  if [[ $quiet -eq 0 ]]; then
    echo "${fg_bold[red]}Environment configuration not found for $reset_color${fg_bold[default]}${environment}$reset_color"
  fi
  return 1
fi

# quiet can potentially be overwritten
sshhh=${quiet}

# shellcheck disable=SC1090
source "./scripts/env/environments/${environment}.env"
EXIT_CODE="$?"
if [ "${EXIT_CODE}" != "0" ]; then
  return $EXIT_CODE
fi


if [[ $environment != "local" ]]; then
  source "./scripts/env/environments/00-common"

  if [[ $sshhh -eq 0 ]] && [[ -n "$CURRENT_COLOR" ]]; then
    echo "  ___   ___      _____  ___  _  _ ";
    echo " |   \ /_\ \    / / __|/ _ \| \| |";
    echo " | |) / _ \ \/\/ /\__ \ (_) | .\` |";
    echo " |___/_/ \_\_/\_/ |___/\___/|_|\_|";
    echo "                                  ";
    echo "         env:   $fg_bold[default]${DAWSON_ENV}$reset_color"
    echo "         color: $fg_bold[${CURRENT_COLOR}]${CURRENT_COLOR}$reset_color"
    echo -e "         table: $fg_bold[default]${SOURCE_TABLE}$reset_color\n"
  fi
fi
