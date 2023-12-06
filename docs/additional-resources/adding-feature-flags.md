# Adding feature flags

To add a feature flag:

1. Add the feature flag to `ALLOWLIST_FEATURE_FLAGS` in `EntityConstants.ts`
2. Add the new feature flag record into `efcms-local.json`
3. Update the hardcoded feature flags object being returned in `web-client/integration-tests/helpers.ts` to include the new feature flag
