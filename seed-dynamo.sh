#!/bin/bash

. ./setup-local-env.sh

node ./web-api/create-dynamo-tables.js
node ./web-api/seed-dynamo.js
