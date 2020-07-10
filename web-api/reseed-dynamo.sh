#!/bin/bash

echo "creating dynamo tables"
node create-dynamo-tables.js

echo "seeding dynamo"
node seed-dynamo.js
