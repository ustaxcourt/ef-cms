import { defineConfig } from 'cypress';
import { setAllowedTerminalIpAddresses } from './cypress/cypress-integration/support/database';
import fs from 'fs';
import path from 'path';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
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
    specPattern: 'cypress/cypress-integration/integration/public/*.cy.ts',
    supportFile: 'cypress/cypress-integration/support/index.ts',
    testIsolation: false,
  },
  fixturesFolder: 'cypress/cypress-integration/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 12000,
  screenshotOnRunFailure: false,
  screenshotsFolder: 'cypress/cypress-integration/screenshots',
  video: true,
  videosFolder: 'cypress/cypress-integration/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
