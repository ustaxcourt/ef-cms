#!/bin/bash
COUNT=$(git diff --name-only origin/develop | grep web-client | wc -l)
if [ $COUNT == "0" ] ; then
  echo "No changes detected inside the web-client folder; exiting ending the pipeline";
  exit 1;
fi
