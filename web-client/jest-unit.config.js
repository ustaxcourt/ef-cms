const baseConfig = require('../jest.config');

const { TextDecoder, TextEncoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

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
      branches: 94.56,
      functions: 98.81,
      lines: 99.25,
      statements: 99.23,
    },
  },
  globals: {
    File() {},
    FileReader() {},
    TextDecoder,
    TextEncoder,
    atob: x => x,
    presenter: { providers: { applicationContext: {} } },
  },
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
  },
  testEnvironment: './JsdomWithTextEncoderEnvironment.js',
  //this is to ignore imported html files
  // transform: {
  //   '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  //   '^.+\\.html?$': './htmlLoader.js',
  // },
};
