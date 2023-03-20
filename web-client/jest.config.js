const baseConfig = require('../jest.config');

module.exports = {
  ...baseConfig,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/index.js',
    '!src/index-public.js',
    '!integration-tests/**/*.js',
    '!integration-tests-public/**/*.js',
    '!src/applicationContext',
    '!src/applicationContextPublic.js',
    '!src/applicationContextTriggers.js',
    '!src/router.js',
    '!src/routerPublic.js',
    '!src/index.dev.js',
    '!src/index.prod.js',
    '!src/index-public.dev.js',
    '!src/index-public.prod.js',
    '!src/presenter/state.js',
  ],
  coverageDirectory: './coverage',
  globals: {
    Blob() {},
    File() {},
    FileReader: () => {},
    atob: x => x,
  },
  testEnvironment: 'node',
  testTimeout: 60000,
};
