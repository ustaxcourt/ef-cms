import fs from 'fs';
import { getOutputsForCurrentCiNode } from './helpers/splitTestFiles';

// # Usage
// #   npx ts-node scripts/github-actions/split-tests-cypress.ts integration
// #   npx ts-node scripts/github-actions/split-tests-cypress.ts accessibility

// # Arguments
// #   - $1 - the folder of tests to include when looking for tests to split across action runners

export const main = (args: string[] = process.argv.slice(2)): string => {
  const testFolderToInclude = args[0] || '';
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
  const output = getOutputsForCurrentCiNode({
    files,
  }).join(',');

  console.log(output);

  return output;
};

/* istanbul ignore next */
if (require.main === module) {
  main();
}
