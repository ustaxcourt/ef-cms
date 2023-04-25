#!/bin/bash

echo "creating dynamo tables"
node create-dynamo-tables.js

echo "seeding dynamo"
npx ts-node --transpile-only ./seed-dynamo.ts
