#!/bin/bash -e

ENV=$1

# shellcheck disable=SC1091
. ./scripts/load-environment-from-secrets.sh

npx ts-node --transpile-only scripts/user/setup-test-users.ts
