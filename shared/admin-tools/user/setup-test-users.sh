#!/bin/bash -e

ENV=$1

# Getting the account-wide deployment settings and injecting them into the shell environment
. ./scripts/load-environment-from-secrets.sh

node shared/admin-tools/user/setup-test-users.js
