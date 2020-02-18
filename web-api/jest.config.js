module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'switch-environment-color.js',
    'migrations/*.js',
    'migrations/utilities.js',
    'src/customHandle.js',
    'src/apiGatewayHelper.js',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  verbose: false,
};
