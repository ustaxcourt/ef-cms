const fs = require('fs');
const path = require('path');
const {
  setAllowedTerminalIpAddresses,
} = require('./cypress-integration/support/database');
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  defaultCommandTimeout: 20000,
  e2e: {
    baseUrl: 'http://localhost:5678',
    setupNodeEvents(on) {
      on('task', {
        modifyDeployedDateTextFile(deployedDate) {
          fs.writeFileSync(
            path.join(__dirname, './dist-public/deployed-date.txt'),
            deployedDate,
          );
          return null;
        },
        setAllowedTerminalIpAddresses(ipAddresses) {
          return setAllowedTerminalIpAddresses(ipAddresses);
        },
      });
    },
    specPattern: 'cypress-integration/integration/public/*.cy.js',
    supportFile: 'cypress-integration/support/index.js',
    testIsolation: false,
  },
  fixturesFolder: 'cypress-integration/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 12000,
  screenshotsFolder: 'cypress-integration/screenshots',
  video: false,
  videosFolder: 'cypress-integration/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
});
