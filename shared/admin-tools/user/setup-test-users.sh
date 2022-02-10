#!/bin/bash -e

ENV=$1

if [ -z ${DEFAULT_ACCOUNT_PASS} ]; then
  # Getting the account-wide deployment settings and injecting them into the shell environment
  . ./scripts/load-environment-from-secrets.sh
fi

node shared/admin-tools/user/setup-test-users.js
