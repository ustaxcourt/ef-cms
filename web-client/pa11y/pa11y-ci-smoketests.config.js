const { EFCMS_DOMAIN, PETITIONS_CLERK_TOKEN } = process.env;

const urls = [
  {
    actions: ['wait for .big-blue-header to be visible'],
    notes: 'verifies that the user can login and the UI is loaded',
    url: `http://app.${EFCMS_DOMAIN}/log-in?token=${PETITIONS_CLERK_TOKEN}&path=/`,
  },
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
