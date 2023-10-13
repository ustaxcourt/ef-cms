#!/bin/bash -e

# Creates all missing feature flag items in the dynamo deploy table

# Usage
#   ENV=dev ./setup-all-env-configuration.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

./scripts/dynamo/setup-document-search-limiter-limits.sh
./scripts/dynamo/setup-terminal-ip-allowlist.sh
./scripts/dynamo/setup-maintenance-mode-flag.sh
./scripts/dynamo/setup-section-outbox-retrieval-days.sh
./scripts/dynamo/setup-add-docket-numbers-to-orders-flag.sh
./scripts/dynamo/setup-updated-trial-session-types-flag.sh
./scripts/dynamo/setup-consolidated-cases-group-access-petitioner-flag.sh
