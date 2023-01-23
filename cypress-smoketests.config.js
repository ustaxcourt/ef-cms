const { defineConfig } = require('cypress');

module.exports = defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 60000,
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        log(message) {
          console.log(message);

          return null;
        },
      });
    },
    specPattern: 'cypress-smoketests/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress-smoketests/support/index.js',
    testIsolation: false,
  },
  fixturesFolder: 'cypress-smoketests/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 60000,
  retries: 0,
  screenshotsFolder: 'cypress-smoketests/screenshots',
  video: true,
  videoCompression: 10,
  videoUploadOnPasses: false,
  videosFolder: 'cypress-smoketests/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
});
