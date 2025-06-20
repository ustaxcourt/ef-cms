#!/bin/bash -e

. ./setup-local-env.sh

export NODE_OPTIONS="--inspect=9230"

nodemon -e js,ts --ignore web-client/ --ignore dist/ --ignore dist-public/ --ignore cypress/ --exec "npx ts-node --transpile-only web-api/src/app-local.ts"
