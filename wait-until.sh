#!/bin/bash -e

# This script waits for a specified service to come online

# Usage
#   URL=http://localhost:4000/api/swagger wait-until.sh

( ! command -v curl > /dev/null ) && echo "Curl was not found on your path. Please install curl." && exit 1
max_tries=${MAX_TRIES:-100}
check_code=${CHECK_CODE:-"200"}
try_count=0

while true; do
  set +e
  code=$(curl -sL -w "%{http_code}\\n" "$URL" -o /dev/null --connect-timeout 2 --max-time 5)
  set -e

  [[ -z "$NO_REMINDERS" ]] && echo -e "\nWaiting for $URL to be hosted...\n"
  [[ "$code" == "$check_code" ]] && break

  if ((++try_count > max_tries)); then
    echo -e "\n:(  giving up after $max_tries tries. Last code was $code\n"
    exit 1
  fi
  sleep 2
done
echo -e "\n$URL is up!\n"
