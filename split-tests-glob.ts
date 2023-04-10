import shuffleSeed from 'shuffle-seed';
let glob = require('glob');

const testType = process.argv[2] || '';

let testFiles;
if (testType.includes('unit')) {
  // could use for shared? pass the path?
  testFiles = glob(
    './web-client/src/**/?(*.)+(spec|test).[jt]s?(x)',
    function (err, files) {
      if (err) {
        console.log('ooooops', err);
      }

      return files;
    },
  );
}
const shuffled = shuffleSeed.shuffle(testFiles, process.env.GITHUB_SHA);

const total = parseInt(process.env.CI_NODE_TOTAL!, 10);
const index = parseInt(process.env.CI_NODE_INDEX!, 10);

const tests = shuffled.filter((num, i) => i % total === index);

console.log(tests.join(' '));
