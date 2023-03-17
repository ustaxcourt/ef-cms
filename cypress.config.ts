import { defineConfig } from 'cypress';
import { getEmailVerificationToken } from './cypress/cypress-integration/support/database';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
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
  retries: 4,
  screenshotsFolder: 'cypress-integration/screenshots',
  video: false,
  videosFolder: 'cypress-integration/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
});
