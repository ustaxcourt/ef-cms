#!/bin/bash -e

. ./setup-local-env.sh

npx ts-node --transpile-only web-api/src/app-streams.ts