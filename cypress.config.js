const {
  getEmailVerificationToken,
} = require('./cypress-integration/support/database');
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 60000,
  e2e: {
    baseUrl: 'http://localhost:1234',
    setupNodeEvents(on) {
      on('task', {
        getEmailVerificationToken({ userId }) {
          return getEmailVerificationToken({ userId });
        },
      });
    },
    specPattern: 'cypress-integration/integration/*.cy.js',
    supportFile: 'cypress-integration/support/index.js',
    testIsolation: false,
  },
  fixturesFolder: 'cypress-integration/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 60000,
  retries: 0,
  screenshotsFolder: 'cypress-integration/screenshots',
  video: false,
  videosFolder: 'cypress-integration/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
});
