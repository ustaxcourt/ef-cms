const fs = require('fs');
const shuffleSeed = require('shuffle-seed');

const specDir = './web-client/integration-tests';
const files = fs.readdirSync(specDir).filter(f => f.endsWith('test.js'));

const shuffled = shuffleSeed.shuffle(files, process.env.GITHUB_SHA);

const total = parseInt(process.env.CI_NODE_TOTAL, 10);
const index = parseInt(process.env.CI_NODE_INDEX, 10);

const tests = shuffled.filter((num, i) => i % total === index);

console.log(tests.join(' '));
