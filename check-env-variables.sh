#!/bin/bash -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# verify expected env variables are set
for EXPECTED_ENV_VAR in "$@"
do
  [ -z "${!EXPECTED_ENV_VAR}" ] && MISSING_ENV="true" && printf "%bERROR - You must have %b${EXPECTED_ENV_VAR}%b set in your environment to run this script!%b\n" "${RED}" "${YELLOW}" "${RED}" "${NC}"
done

if [ -n "${MISSING_ENV}" ]; then
  exit 1;
fi


printf "\n%bVerify these env variables seem correct:%b\n" "${GREEN}" "${NC}"
# # print all expected env variables
for EXPECTED_ENV_VAR in "$@"
do
  if [[ ${EXPECTED_ENV_VAR} == *"AWS"* ]] || [[ ${EXPECTED_ENV_VAR} == *"PASS"* ]]; then
    echo "- $EXPECTED_ENV_VAR=*******"
  else
    echo "- $EXPECTED_ENV_VAR=${!EXPECTED_ENV_VAR}"
  fi
done

if [ -z "${CI}" ]; then
  printf  "%bAre you sure you want to continue? (press y to confirm)%b\n\n" "${YELLOW}" "${NC}"
  read -p "continue? (press y to confirm)" -n 1 -r

  echo    # (optional) move to a new line
  if [[ ! ($REPLY =~ ^[Yy]$) ]]
  then
    echo "Aborted..."
    exit 1;
  else
    echo "Continuing..."
  fi
fi
