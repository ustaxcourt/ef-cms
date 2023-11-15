import fs from 'fs';
import shuffleSeed from 'shuffle-seed';

const specDir = './cypress/cypress-integration/integration';
const files = fs.readdirSync(specDir).filter(f => f.endsWith('cy.ts'));

const shuffled = shuffleSeed.shuffle(files, process.env.GITHUB_SHA);

const total = parseInt(process.env.CI_NODE_TOTAL!, 10);
const index = parseInt(process.env.CI_NODE_INDEX!, 10);

const tests = shuffled
  .filter((num, i) => i % total === index)
  .map(file => `./cypress/cypress-integration/integration/${file}`);

console.log(tests.join(','));
