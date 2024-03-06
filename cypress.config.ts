import { defineConfig } from 'cypress';
import {
  getEmailVerificationToken,
  deleteAllFilesInFolder,
} from './cypress/cypress-integration/support/database';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 60000,
  e2e: {
    baseUrl: 'http://localhost:1234',
    experimentalStudio: true,
    setupNodeEvents(on) {
      on('task', {
        getEmailVerificationToken({ userId }) {
          return getEmailVerificationToken({ userId });
        },
        deleteAllFilesInFolder(dir) {
          return deleteAllFilesInFolder(dir);
        },
      });
    },
    specPattern: 'cypress/cypress-integration/integration/*.cy.ts',
    supportFile: 'cypress/cypress-integration/support/index.ts',
    testIsolation: false,
  },
  fixturesFolder: 'cypress/cypress-integration/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 60000,
  retries: 0,
  screenshotsFolder: 'cypress/cypress-integration/screenshots',
  video: true,
  videosFolder: 'cypress/cypress-integration/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
