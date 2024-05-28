import fs from 'fs';
import shuffleSeed from 'shuffle-seed';

const specDir = './cypress/local-only/tests';
const files = fs
  .readdirSync(specDir, { recursive: true })
  .filter(f => (f as string).endsWith('cy.ts') && !f.includes('public/'));

const shuffled = shuffleSeed.shuffle(files, process.env.GITHUB_SHA);

const total = parseInt(process.env.CI_NODE_TOTAL!, 10);
const index = parseInt(process.env.CI_NODE_INDEX!, 10);

const tests = shuffled
  .filter((num, i) => i % total === index)
  .map(file => `./cypress/local-only/tests/${file}`);

console.log(tests.join(','));
