#!/bin/bash

echo "creating dynamo tables"
npx ts-node --transpile-only ./create-dynamo-tables.ts

echo "seeding dynamo"
npx ts-node --transpile-only ./seed-dynamo.ts
