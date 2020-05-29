#!/bin/bash

CLEAN_ONLY=$1

# removes ONLY artifacts from previous runs
rm -rf \
  ~/.serverless \
  .cache/ \
  .dynamodb \
  .elasticsearch \
  dist/ \
  dist-public/

npx jest --clearCache

# if *not* CLEAN_ONLY, do this
if [ -z "$CLEAN_ONLY" ]; then
  # removes all modules, reinstalls
  rm -rf \
    node_modules \
    package-lock.json

  npm i
  npm update
  npx npm-force-resolutions
  npm prune
fi
