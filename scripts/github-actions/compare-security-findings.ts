#!/usr/bin/env -S npx ts-node --transpile-only

import { runCompareSecurityFindingsScript } from './compare-security-findings.helpers';

// Usage: compare-security-findings.ts <tool>:<branch.sarif>:<staging.sarif> ...
process.exitCode = runCompareSecurityFindingsScript({
  specs: process.argv.slice(2),
  stepSummaryPath: process.env.GITHUB_STEP_SUMMARY,
});
