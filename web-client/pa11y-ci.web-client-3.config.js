const adc = require('./pa11y/pa11y-adc');
const petitioner = require('./pa11y/pa11y-petitioner');

const urls = [...petitioner, ...adc];

module.exports = {
  defaults: {
    chromeLaunchConfig: {
      args: ['--no-sandbox'],
    },
    concurrency: 1,
    debug: true,
    'include-notices': true,
    'include-warnings': true,
    standard: 'WCAG2AA',
    timeout: 60000,
    wait: 10000,
  },
  urls,
};
