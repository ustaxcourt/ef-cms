#!/bin/bash -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# verify expected env variables are set
for EXPECTED_ENV_VAR in "$@"
do
  [ -z ${!EXPECTED_ENV_VAR} ] && MISSING_ENV="true" && printf "${RED}ERROR - You must have ${YELLOW}${EXPECTED_ENV_VAR}${RED} set in your environment to run this script${NC}!\n"
done

if [ ! -z ${MISSING_ENV} ]; then
  exit 1;
fi


printf "\n${GREEN}Verify these env variables seem correct:${NC}\n"
# # print all expected env variables
for EXPECTED_ENV_VAR in "$@"
do
  if [[ ${EXPECTED_ENV_VAR} == *"AWS"* ]] || [[ ${EXPECTED_ENV_VAR} == *"PASS"* ]]; then
    echo "- $EXPECTED_ENV_VAR=*******"
  else
    echo "- $EXPECTED_ENV_VAR=${!EXPECTED_ENV_VAR}"
  fi
done

printf  "${YELLOW}Are you sure you want to continue? (press y to confirm)${NC}\n\n"
read -p "continue? (press y to confirm)" -n 1 -r

echo    # (optional) move to a new line
if [[ !($REPLY =~ ^[Yy]$) ]]
then
  echo "Aborted..."
  exit 1;
else
  echo "Continuing..."
fi