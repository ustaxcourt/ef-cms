// a global config if running tests singly on CLI
// this file also contains a set of configuration defaults which can
// be imported / overridden as a base configuration elsewhere.
const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
  },
  testEnvironment: `${__dirname}/web-client/JsdomWithTextEncoderEnvironment.js`,
};
