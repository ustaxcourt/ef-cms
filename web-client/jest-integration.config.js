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
  transform: {
    '^.+\\.html?$': './htmlLoader.js',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.jsx$': 'babel-jest',
  },
};
