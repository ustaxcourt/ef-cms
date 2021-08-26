#!/bin/bash

exit_on_finished() {
  node shared/admin-tools/elasticsearch/check-reindex-complete.js $ENV
  code=$?
  if [ $code -eq 0 ]; then
    echo "Reindexing complete"
    exit 0
  fi
}

while true
do
  exit_on_finished
  echo "re-index still processing, sleeping for 1 minute to check again."
  echo ""
  sleep 60
done
