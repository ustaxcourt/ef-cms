#!/bin/bash -e
cd efcms-service 
npm run install:dynamodb
npm run start:dynamodb
# npm run start:local &
# sleep 5
# npm run create-tables

# sleep 5
# cd ../web-client
# npm run test