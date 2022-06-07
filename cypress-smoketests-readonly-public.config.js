const { defineConfig } = require('cypress');

module.exports = defineConfig({
  browser: 'chrome',
  defaultCommandTimeout: 20000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress-readonly/plugins/index.js')(on, config);
    },
    specPattern: 'cypress-readonly/integration/public/*.spec.js',
    supportFile: 'cypress-readonly/support/index.js',
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
