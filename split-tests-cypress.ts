import fs from 'fs';
import { getOutputsForCurrentCiNode } from './scripts/helpers/splitTestFiles';

// # Usage
// #   npx ts-node split-tests-cypress.ts integration
// #   npx ts-node split-tests-cypress.ts accessibility

// # Arguments
// #   - $1 - the folder of tests to include when looking for tests to split across action runners

const args = process.argv.slice(2);
const testFolderToInclude = args[0];
const shouldExcludePublicTests = !testFolderToInclude.includes('public');

const specDir = './cypress/local-only/tests';
const files = fs
  .readdirSync(specDir, { recursive: true })
  .filter(
    f =>
      (f as string).endsWith('cy.ts') &&
      (!shouldExcludePublicTests || !f.includes('public/')) &&
      f.includes(`${testFolderToInclude}/`),
  )
  .map(file => ({
    output: `./cypress/local-only/tests/${file}`,
    path: `./cypress/local-only/tests/${file}`,
  }));

const tests = getOutputsForCurrentCiNode({
  files,
});

console.log(tests.join(','));
