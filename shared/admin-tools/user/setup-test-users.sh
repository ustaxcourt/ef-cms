#!/bin/bash -e

ENV=$1

# Getting the account-wide deployment settings and injecting them into the shell environment
if [ -z "${SECRETS_LOADED}" ]; then
    . ./scripts/load-environment-from-secrets.sh
fi

node shared/admin-tools/user/setup-test-users.js
