const practitioner = require('./pa11y/pa11y-practitioner');
const respondent = require('./pa11y/pa11y-respondent');

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
  urls: [...practitioner, ...respondent],
};
