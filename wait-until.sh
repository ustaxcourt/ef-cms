#!/bin/bash
url=$1
while [ true ]
do
  code=`curl -sL -w "%{http_code}\\n" "$url" -o /dev/null`
  echo -e "Waiting for $url to be hosted...\n"
  if [ "x$code" = "x200" ]
  then
    break
  fi
  sleep 2
done