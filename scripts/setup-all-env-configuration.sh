#!/bin/bash -e

# Creates all missing feature flag items in the database

# Usage
#   ENV=dev ./setup-all-env-configuration.sh

./check-env-variables.sh \
  "ENV" \
  "AWS_SECRET_ACCESS_KEY" \
  "AWS_ACCESS_KEY_ID"

./scripts/postgres/featureFlags/setup-aws-batch-zipper-minimum-count.ts
./scripts/postgres/featureFlags/setup-chief-judge-name-flag.ts
./scripts/postgres/featureFlags/setup-clerk-of-court-config.ts
./scripts/postgres/featureFlags/setup-document-visibility-policy-change-date.ts
./scripts/postgres/featureFlags/setup-e-consent-fields-enabled-feature-flag.ts
./scripts/postgres/featureFlags/setup-section-outbox-retrieval-days.ts
./scripts/postgres/featureFlags/setup-terminal-ip-allowlist.ts
./scripts/postgres/featureFlags/setup-use-change-of-address-lambda-flag.ts
