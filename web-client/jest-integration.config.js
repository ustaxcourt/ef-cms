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
};
