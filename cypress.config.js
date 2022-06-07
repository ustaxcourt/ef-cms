const fs = require('fs');
const path = require('path');
const {
  getEmailVerificationToken,
  reseedDatabase,
  setAllowedTerminalIpAddresses,
} = require('./cypress-integration/support/database');
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  browser: 'edge',
  chromeWebSecurity: false,
  defaultCommandTimeout: 20000,
  e2e: {
    baseUrl: 'http://localhost:1234',
    setupNodeEvents(on) {
      on('task', {
        getEmailVerificationToken({ userId }) {
          return getEmailVerificationToken({ userId });
        },
        modifyDeployedDateTextFile(deployedDate) {
          fs.writeFileSync(
            path.join(__dirname, '../../web-client/src/deployed-date.txt'),
            deployedDate,
          );
          return null;
        },
        seed() {
          return reseedDatabase();
        },
        setAllowedTerminalIpAddresses(ipAddresses) {
          return setAllowedTerminalIpAddresses(ipAddresses);
        },
      });
    },
    specPattern: 'cypress-integration/integration/*.spec.js',
    supportFile: 'cypress-integration/support/index.js',
  },
  fixturesFolder: 'cypress-integration/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 12000,
  retries: 3,
  screenshotsFolder: 'cypress-integration/screenshots',
  video: false,
  videosFolder: 'cypress-integration/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
});
