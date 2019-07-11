#!/bin/bash -e 

# This script runs lint, tests, cypress, and pa11y over an already running 
# application.  This can only be run with a clean start of the web-api.

# For more thorough validations, run the ./build-all.sh script since that
# runs basically all the same things Jenkins runs.

# shared
pushd shared
npm run lint
npm test
popd

# web-api
pushd web-api
npm run lint
npm test
popd

# web-client
pushd web-client
npm run lint
npm run test:unit
npm test
npm run cypress
npm run test:pa11y
popd