#!/bin/bash
url=$1
while [ true ]
do
  code=`curl -sL -w "%{http_code}\\n" "$url" -o /dev/null`
  echo "Found code $code"
  if [ "x$code" = "x200" ]
  then
    break
  fi
  sleep 2
done