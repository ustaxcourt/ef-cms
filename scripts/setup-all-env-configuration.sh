#!/bin/bash

# Creates all missing feature flag items in the dynamo deploy table

# Usage
#   ./setup-all-env-configuration.sh dev

# Arguments
#   - $1 - the environment to set the flag

./scripts/setup-internal-order-search-flag.sh $1
./scripts/setup-external-order-search-flag.sh $1
./scripts/setup-internal-opinion-search-flag.sh $1
./scripts/setup-pdfjs-flag.sh $1
./scripts/rename-order-search-flag-to-internal.sh $1
./scripts/setup-document-search-limiter-limits.sh $1
./scripts/setup-terminal-ip-allowlist.sh $1
./scripts/setup-maintenance-mode-flag.sh $1