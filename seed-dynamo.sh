#!/bin/bash

# shellcheck disable=SC1091
. ./setup-local-env.sh

npx ts-node ./web-api/create-dynamo-tables.js
npx ts-node ./web-api/seed-dynamo.js
