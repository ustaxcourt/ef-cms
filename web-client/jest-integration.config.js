const baseConfig = require('../jest.config');

module.exports = {
  ...baseConfig,
  collectCoverage: false,
  globals: {
    File() {},
    FileReader: () => {},
    atob: x => x,
  },
  testEnvironment: 'node',
  testTimeout: 30000,
  //this is to ignore imported html files
  // transform: {
  //   '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  //   '^.+\\.html?$': './htmlLoader.js',
  // },
};
