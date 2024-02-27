#!/bin/bash -e

ENV=$1

# Getting the account-wide deployment settings and injecting them into the shell environment
if [ -z "${SECRETS_LOADED}" ]; then
    # shellcheck disable=SC1091
    . ./scripts/load-environment-from-secrets.sh
fi

npx ts-node --transpile-only scripts/user/setup-test-users.ts
