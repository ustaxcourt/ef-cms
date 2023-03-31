#!/bin/bash -e

# This script waits for a specified service to come online

# Usage
#   URL=http://localhost:4000/api/swagger wait-until.sh

( ! command -v curl > /dev/null ) && echo "Curl was not found on your path. Please install curl." && exit 1
max_tries=100
check_code=${CHECK_CODE:-"200"}
try_count=0

while true
do
  set +e
  code=$(curl -sL -w "%{http_code}\\n" "$URL" -o /dev/null)
  set -e

  echo -e "\nWaiting for $URL to be hosted...\n"
  if [ "$code" = "$check_code" ]
  then
    break
  fi

  if ((++try_count > max_tries)); then
    echo -e ":(  giving up.\n"
    exit 1
  fi
  sleep 2
done
