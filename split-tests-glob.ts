import glob from 'glob';

const testType = process.argv[2] || '';

let testFiles;
if (testType.includes('unit')) {
  testFiles = glob.sync('./web-client/src/**/?(*.)+(spec|test).[jt]s?(x)');
} else if (testType.includes('shared')) {
  testFiles = glob.sync('./shared/src/**/?(*.)+(spec|test).[jt]s');
}

const total = parseInt(process.env.CI_NODE_TOTAL!, 10);
const index = parseInt(process.env.CI_NODE_INDEX!, 10);
const tests = testFiles
  .filter((_num, i) => i % total === index)
  // Jest 30 testPathPattern is a RegExp over normalized paths; a leading `./`
  // prevents some paths (e.g. .../dto/cases/*.test.ts) from matching, so those
  // suites never run in CI despite appearing in the alternation string.
  .map(p => (p.startsWith('./') ? p.slice(2) : p));
console.log(tests.join('|'));
