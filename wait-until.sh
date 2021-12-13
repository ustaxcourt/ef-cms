#!/bin/bash -e

# This script waits for a specified service to come online

# Usage
#   URL=http://localhost:4000/api/swagger wait-until.sh

( ! command -v curl > /dev/null ) && echo "Curl was not found on your path. Please install curl." && exit 1
max_tries=900
try_count=0
check_code=${CHECK_CODE:-"200"}
is_ws=${IS_WS:-"false"}

while true
do
  set +e
  if [ "$is_ws" = "true" ]; then
    code=$(curl -sL -w "%{http_code}\\n" -o /dev/null --include --no-buffer --header "Connection: Upgrade" --header "Upgrade: websocket" --header "Host: $URL" --header "Origin: $URL" --header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" --header "Sec-WebSocket-Version: 13" "$URL")
  else
    code=$(curl -sL -w "%{http_code}\\n" "$URL" -o /dev/null)
  fi
  set -e

  echo -e "\nWaiting for $URL to be hosted...\n"
  if [ "x$code" = "x$check_code" ]
  then
    break
  fi
  if ((++try_count > max_tries)); then
    echo -e ":(  giving up.\n"
    exit 1
  fi
  sleep 2
done
