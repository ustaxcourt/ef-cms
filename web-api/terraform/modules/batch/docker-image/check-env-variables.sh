#!/bin/bash -e

# shellcheck disable=SC1091
source "./suppress-output.sh"

{
  [[ -n $ZSH_VERSION && $ZSH_EVAL_CONTEXT =~ :file$ ]] ||
  [[ -n $BASH_VERSION ]] && (return 0 2>/dev/null);
} && sourced=1 || sourced=0
[[ $sourced -eq 0 ]] && exit="exit" || exit="return"

quiet=$(should_suppress_output "$@")

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# verify expected env variables are set
for EXPECTED_ENV_VAR in "$@"
do
  if [[ "$EXPECTED_ENV_VAR" != "--quiet" ]] && [[ "$EXPECTED_ENV_VAR" != "-q" ]]; then
    # shellcheck disable=SC2296
    if {
      [[ -n $BASH_VERSION ]] && [[ -z "${!EXPECTED_ENV_VAR}" ]];
    } || {
      [[ -n $ZSH_VERSION ]] && [[ -z "${(P)EXPECTED_ENV_VAR}" ]];
    }; then
      MISSING_ENV="true"
      if [[ $quiet -eq 0 ]]; then
        printf "%bERROR - You must have %b${EXPECTED_ENV_VAR}%b set in your environment to run this script!%b\n" "${RED}" "${YELLOW}" "${RED}" "${NC}"
      fi
    fi
  fi
done

if [[ -n "${MISSING_ENV}" ]]; then
  $exit 1;
fi

if [[ $quiet -eq 0 ]]; then
  printf "\n%bVerify these env variables seem correct:%b\n" "${GREEN}" "${NC}"
  # # print all expected env variables
  for EXPECTED_ENV_VAR in "$@"
  do
    if [[ ${EXPECTED_ENV_VAR} == *"AWS"* ]] || [[ ${EXPECTED_ENV_VAR} == *"PASS"* ]]; then
      echo "- $EXPECTED_ENV_VAR=*******"
    else
      # shellcheck disable=SC2296
      [[ -n $BASH_VERSION ]] && value="${!EXPECTED_ENV_VAR}" || value="${(P)EXPECTED_ENV_VAR}"
      echo "- $EXPECTED_ENV_VAR=${value}"
    fi
  done

  if [[ -z "${CI}" ]] && { [[ -n $BASH_VERSION ]] || [[ $sourced -eq 0 ]]; }; then
    printf  "%bAre you sure you want to continue? (press y to confirm)%b\n\n" "${YELLOW}" "${NC}"
    read -p "continue? (press y to confirm)" -n 1 -r

    echo    # (optional) move to a new line
    if [[ ! ($REPLY =~ ^[Yy]$) ]]; then
      echo "Aborted..."
      $exit 1;
    else
      echo "Continuing..."
    fi
  fi
fi
