// a global config if running tests singly on CLI
// this file also contains a set of configuration defaults which can
// be imported / overridden as a base configuration elsewhere.
module.exports = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: './coverage',
  coverageProvider: 'babel',
  setupFilesAfterEnv: [`${__dirname}/enzyme.config.js`],
  testSequencer: `${__dirname}/jestSequencer.js`,
  verbose: false,
};
