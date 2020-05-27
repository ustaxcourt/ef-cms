// a global config if running tests singly on CLI
// this file also contains a set of configuration defaults which can
// be imported / overridden as a base configuration elsewhere.
module.exports = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: './coverage',
  coverageProvider: 'babel',
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  setupFilesAfterEnv: [`${__dirname}/enzyme.config.js`],
  verbose: false,
};
