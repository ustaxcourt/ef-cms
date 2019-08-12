#!/bin/bash -e

# This script runs lint, tests, cypress, and pa11y over an already running
# application.  This can only be run with a clean start of the web-api.

# For more thorough validations, run the ./build-all.sh script since that
# runs basically all the same things CircleCI runs.

npm ci
npm run lint
sh ./run-shellcheck.sh
npx run-p test:api test:client test:shared test:pa11y

echo "NOTE: to run cypress, you will need to run client with the start:client:ci script. "
# With the back-end already running, try this:
# npm run start:client:ci && ./wait-until.sh http://localhost:1234 && npm run cypress
