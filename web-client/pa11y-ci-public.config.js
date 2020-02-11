const urls = [
  'http://localhost:5678/',
  'http://localhost:5678/case-detail/101-19',
  'http://localhost:5678/case-detail/101-19/generate-docket-record',
];

module.exports = {
  defaults: {
    chromeLaunchConfig: {
      args: ['--no-sandbox'],
    },
    concurrency: 3,
    debug: true,
    'include-notices': true,
    'include-warnings': true,
    standard: 'WCAG2AA',
    timeout: 30000,
    wait: 5000,
  },
  urls,
};
