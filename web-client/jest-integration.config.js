const baseConfig = require('../jest.config');

// adding a comment to force run

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
  workerIdleMemoryLimit: 0.3,
};
