#!/bin/bash

# shellcheck disable=SC1091
. ./setup-local-env.sh

npx ts-node --transpile-only ./web-api/create-dynamo-tables.js
npx ts-node --transpile-only ./web-api/seed-dynamo.ts
