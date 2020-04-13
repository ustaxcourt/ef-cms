const baseConfig = require('../jest.config');

module.exports = {
  ...baseConfig,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!integration-tests/**/*.js',
    '!integration-tests-public/**/*.js',
    '!src/applicationContext.js',
    '!src/applicationContextPublic.js',
    '!src/router.js',
    '!src/routerPublic.js',
    '!src/index.dev.js',
    '!src/index.prod.js',
    '!src/index-public.dev.js',
    '!src/index-public.prod.js',
  ],
  coverageDirectory: './coverage-unit',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 40,
      lines: 45,
      statements: 45,
    },
  },
  globals: {
    File: function () {},
    FileReader: function () {},
    atob: x => x,
    presenter: { providers: { applicationContext: {} } },
    window: { document: {} },
  },
  //this is to ignore imported html files
  testEnvironment: 'node',
  transform: {
    '^.+\\.html?$': './htmlLoader.js',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.jsx$': 'babel-jest',
  },
};
