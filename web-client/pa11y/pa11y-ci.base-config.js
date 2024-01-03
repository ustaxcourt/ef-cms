const jsCheckDecorator = testUrl => {
  let decorated;
  if (typeof testUrl === 'string') {
    decorated = {
      actions: ['wait for .progress-indicator to be hidden'],
      notes: 'verifies that page has loaded and JS is not broken',
      url: testUrl,
    };
  } else {
    decorated = testUrl;
  }
  return decorated;
};

const defaults = {
  chromeLaunchConfig: {
    args: ['--no-sandbox'],
  },
  concurrency: 8,
  debug: true,
  'include-notices': true,
  'include-warnings': true,
  onError: (error, context) => {
    console.error(`Error during action: ${context.action}`);
    console.error(error);
  },
  standard: 'WCAG2AA',
  timeout: 60000,
  wait: 10000,
};

module.exports = {
  defaults,
  jsCheckDecorator,
};
