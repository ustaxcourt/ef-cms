#!/bin/bash
url=$1
max_tries=900
try_count=0
check_code=${2:-"200"}
while true
do
  code=$(curl -sL -w "%{http_code}\\n" "$url" -o /dev/null)
  echo -e "\nWaiting for $url to be hosted...\n"
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
