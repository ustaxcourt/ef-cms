#!/bin/bash -e

# Creates all missing feature flag items in the dynamo deploy table

# Usage
#   ENV=dev ./setup-all-env-configuration.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

./scripts/setup-internal-order-search-flag.sh
./scripts/setup-external-order-search-flag.sh
./scripts/setup-internal-opinion-search-flag.sh
./scripts/setup-external-opinion-search-flag.sh
./scripts/setup-pdfjs-express-viewer-flag.sh
./scripts/rename-order-search-flag-to-internal.sh
./scripts/setup-document-search-limiter-limits.sh
./scripts/setup-terminal-ip-allowlist.sh
./scripts/setup-maintenance-mode-flag.sh
