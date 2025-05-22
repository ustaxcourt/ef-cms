import { defineConfig } from 'cypress';
import { toggleFeatureFlagFromPostgres } from './cypress/helpers/cypressTasks/postgres/postgres-helpers';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  defaultCommandTimeout: 60000,
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
          return toggleFeatureFlagFromPostgres({
            flag: 'allowed-terminal-ips',
            flagValue: ipAddresses,
          });
        },
        table(message) {
          console.table(message);
          return null;
        },
        toggleFeatureFlagFromPostgres(args) {
          return toggleFeatureFlagFromPostgres(args);
        },
      });
    },
    specPattern: [
      'cypress/local-only/tests/integration/public/**/*.cy.ts',
      'cypress/local-only/tests/accessibility/public/**/*.cy.ts',
    ],
    supportFile: 'cypress/local-only/support/index.ts',
    testIsolation: false,
  },
  fixturesFolder: 'cypress/local-only/fixtures',
  injectDocumentDomain: true,
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 12000,
  screenshotOnRunFailure: false,
  screenshotsFolder: 'cypress/local-only/screenshots',
  video: true,
  videosFolder: 'cypress/local-only/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
