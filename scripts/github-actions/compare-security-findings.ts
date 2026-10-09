#!/usr/bin/env -S npx ts-node --transpile-only

import { appendFileSync } from 'fs';
import {
  compareToolFindings,
  hasRegressions,
  readSarifFindings,
  renderComparisonTable,
  renderFindings,
} from './compare-security-findings.helpers';

/*
 Compares SARIF findings against staging one by one, and fails when this branch has a
 finding staging does not. Both sides are scanned in one job, so a newly published CVE
 against code already on staging appears on both sides and cannot fail a pull request.

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
    branchFindings: readSarifFindings(branchReport),
    stagingFindings: readSarifFindings(stagingReport),
    tool,
  });
});

const report = [
  renderComparisonTable(comparisons),
  renderFindings(comparisons, 'newFindings'),
  renderFindings(comparisons, 'existingFindings'),
]
  .filter(Boolean)
  .join('\n\n');
console.log(report);

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `### Security findings vs staging\n\n${report}\n\n`,
  );
}

if (hasRegressions(comparisons)) {
  console.error(
    '\nERROR: this branch adds security findings that staging does not have.',
  );
  process.exit(1);
}

console.log('\nNo security findings beyond those already on staging.');
