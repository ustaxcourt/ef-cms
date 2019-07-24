#!/bin/bash
url=$1
max_tries=30
try_count=0
while [ true ]
do
  code=`curl -sL -w "%{http_code}\\n" "$url" -o /dev/null`
  echo -e "Waiting for $url to be hosted...\n"
  if [ "x$code" = "x200" ]
  then
    break
  fi
  if ((++try_count > max_tries)); then
    echo -e ":(  giving up.\n"
    exit 1
  fi  
  sleep 2
done