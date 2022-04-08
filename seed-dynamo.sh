#!/bin/bash

# shellcheck disable=SC1091
. ./setup-local-env.sh

node ./web-api/create-dynamo-tables.js
node ./web-api/seed-dynamo.js
