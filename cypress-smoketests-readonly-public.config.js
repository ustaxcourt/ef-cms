const { defineConfig } = require('cypress');

module.exports = defineConfig({
  defaultCommandTimeout: 20000,
  e2e: {
    specPattern: 'cypress-readonly/integration/public/*.cy.js',
    supportFile: 'cypress-readonly/support/index.js',
    testIsolation: false,
  },
  fixturesFolder: 'cypress-readonly/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 20000,
  screenshotsFolder: 'cypress-readonly/screenshots',
  video: true,
  videoCompression: 10,
  videoUploadOnPasses: false,
  videosFolder: 'cypress-readonly/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
});
