#!/usr/bin/env -S npx ts-node --transpile-only

import { appendFileSync } from 'fs';
import {
  compareToolFindings,
  hasRegressions,
  readSarifCount,
  renderComparisonTable,
} from './compare-security-findings.helpers';

/*
 Compares SARIF findings on this branch against staging, the way
 compareTypescriptErrors.ts compares type errors. Both sides are scanned in the same
 job so they share a vulnerability database, and a newly published CVE cannot fail a
 pull request on its own.

 Usage: compare-security-findings.ts <tool>:<branch.sarif>:<staging.sarif> ...
*/

const specs = process.argv.slice(2);

if (specs.length === 0) {
  console.error(
    'usage: compare-security-findings.ts <tool>:<branch.sarif>:<staging.sarif> ...',
  );
  process.exit(1);
}

const comparisons = specs.map(spec => {
  const [tool, branchReport, stagingReport] = spec.split(':');
  if (!tool || !branchReport || !stagingReport) {
    console.error(`Malformed argument: ${spec}`);
    process.exit(1);
  }
  return compareToolFindings({
    branchCount: readSarifCount(branchReport),
    stagingCount: readSarifCount(stagingReport),
    tool,
  });
});

const table = renderComparisonTable(comparisons);
console.log(table);

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `### Security findings vs staging\n\n${table}\n\n`,
  );
}

if (hasRegressions(comparisons)) {
  console.error(
    '\nERROR: this branch introduces security findings that staging does not have.',
  );
  process.exit(1);
}

console.log('\nNo new security findings compared with staging.');
