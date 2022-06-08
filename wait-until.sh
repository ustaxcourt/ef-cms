#!/bin/bash -e

# This script waits for a specified service to come online

# Usage
#   URL=http://localhost:4000/api/swagger wait-until.sh

( ! command -v curl > /dev/null ) && echo "Curl was not found on your path. Please install curl." && exit 1
max_tries=900
try_count=0

while true
do
  set +e
  curl -sL -w "%{http_code}\\n" "$URL" -o /dev/null > /dev/null 2>&1
  exitCode=$?
  set -e

  echo -e "\nWaiting for $URL to be hosted...\n"
  if [ $exitCode -eq 0 ]; then
    break  
  fi

  if ((++try_count > max_tries)); then
    echo -e ":(  giving up.\n"
    exit 1
  fi
  sleep 2
done
