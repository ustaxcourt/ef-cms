const urls = [
  'http://localhost:5678/',
  'http://localhost:5678/case-detail/101-19',
  'http://localhost:5678/case-detail/101-19/generate-docket-record',
];

// see https://github.com/pa11y/pa11y#command-line-interface

module.exports = {
  defaults: {
    concurrency: 3,
    debug: true,
    'include-notices': true,
    'include-warnings': true,
    standard: 'WCAG2AA',
    timeout: 30000,
    useIncognitoBrowserContext: true,
    wait: 5000,
  },
  urls,
};
