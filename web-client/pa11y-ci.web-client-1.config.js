const adc = require('./pa11y/pa11y-adc');
const docketclerk = require('./pa11y/pa11y-docketclerk');
const judge = require('./pa11y/pa11y-judge');
const petitioner = require('./pa11y/pa11y-petitioner');

const userUrls = [...docketclerk, ...judge, ...petitioner, ...adc];

const initialUrls = [
  'http://localhost:1234/',
  'http://localhost:1234/mock-login',
  'http://localhost:1234/request-for-page-that-doesnt-exist',
  'http://localhost:1234/idle-logout',
];

if (process.env.CI) {
  initialUrls.push({
    actions: ['wait for element #ci-environment to be visible'],
    notes: 'Confirm Pa11y is running against client in CI mode',
    url:
      'http://localhost:1234/mock-login?token=petitioner&path=/&info=verify-ci-client-environment',
  });
}

// see https://github.com/pa11y/pa11y#command-line-interface

module.exports = {
  defaults: {
    chromeLaunchConfig: {
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
    concurrency: 3,
    debug: true,
    'include-notices': true,
    'include-warnings': true,
    standard: 'WCAG2AA',
    timeout: 30000,
    useIncognitoBrowserContext: true,
    wait: 5000,
  },
  urls: [...initialUrls, ...userUrls],
};
