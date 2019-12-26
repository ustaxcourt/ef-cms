const docketclerk = require('./pa11y/pa11y-docketclerk');

module.exports = {
  defaults: {
    chromeLaunchConfig: {
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
    concurrency: 2,
    debug: true,
    'include-notices': true,
    'include-warnings': true,
    standard: 'WCAG2AA',
    timeout: 30000,
    useIncognitoBrowserContext: true,
    wait: 5000,
  },
  urls: [...docketclerk],
};
