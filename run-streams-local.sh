#!/bin/bash -e

# shellcheck disable=SC1091
. ./setup-local-env.sh

npx ts-node --transpile-only web-api/src/app-streams.ts