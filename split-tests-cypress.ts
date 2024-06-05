import fs from 'fs';
import shuffleSeed from 'shuffle-seed';

// # Usage
// #   npx ts-node split-tests-cypress.ts integration
// #   npx ts-node split-tests-cypress.ts accessibility

// # Arguments
// #   - $1 - the folder of tests to include when looking for tests to split across action runners

const args = process.argv.slice(2);
const testFolderToInclude = args[0];

const specDir = './cypress/local-only/tests';
const files = fs
  .readdirSync(specDir, { recursive: true })
  .filter(
    f =>
      (f as string).endsWith('cy.ts') &&
      !f.includes('public/') &&
      f.includes(`${testFolderToInclude}/`),
  );

const shuffled = shuffleSeed.shuffle(files, process.env.GITHUB_SHA);

const total = parseInt(process.env.CI_NODE_TOTAL!, 10);
const index = parseInt(process.env.CI_NODE_INDEX!, 10);

const tests = shuffled
  .filter((num, i) => i % total === index)
  .map(file => `./cypress/local-only/tests/${file}`);

console.log(tests.join(','));
