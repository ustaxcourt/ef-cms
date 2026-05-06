#!/usr/bin/env -S npx ts-node --transpile-only

import fs from 'fs';
import {
  getOutputsForCurrentCiNode,
  type SplittableFile,
} from './split-tests.helpers';

// # Usage
// #   scripts/github-actions/split-tests-cypress.ts integration
// #   scripts/github-actions/split-tests-cypress.ts accessibility

// # Arguments
// #   - $1 - the folder of tests to include when looking for tests to split across action runners

export const main = (args: string[] = process.argv.slice(2)): string => {
  const testFolderToInclude: string = args[0] || '';
  const shouldExcludePublicTests: boolean =
    !testFolderToInclude.includes('public');
  const specDir: string = './cypress/local-only/tests';
  const directoryEntries: string[] = fs.readdirSync(specDir, {
    encoding: 'utf8',
    recursive: true,
  });
  const files: SplittableFile[] = directoryEntries
    .filter(
      (file: string): boolean =>
        file.endsWith('cy.ts') &&
        (!shouldExcludePublicTests || !file.includes('public/')) &&
        file.includes(`${testFolderToInclude}/`),
    )
    .map(
      (file: string): SplittableFile => ({
        output: `./cypress/local-only/tests/${file}`,
        path: `./cypress/local-only/tests/${file}`,
      }),
    );
  const output: string = getOutputsForCurrentCiNode({
    files,
  }).join(',');

  console.log(output);

  return output;
};

if (require.main === module) {
  main();
}
