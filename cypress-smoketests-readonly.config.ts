import { defineConfig } from 'cypress';
import { getUserToken as getUserTokenLocal } from './cypress/cypress-smoketests/support/pages/local-login';
import { getUserTokenWithRetry } from './cypress/support/cognito-login';

const { CYPRESS_SMOKETESTS_LOCAL } = process.env;

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  defaultCommandTimeout: 60000,
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        getUserToken({ email, password }) {
          return CYPRESS_SMOKETESTS_LOCAL
            ? getUserTokenLocal(email)
            : getUserTokenWithRetry(email, password);
        },
      });
    },
    specPattern: 'cypress/cypress-readonly/integration/*.cy.ts',
    supportFile: 'cypress/cypress-readonly/support/index.ts',
    testIsolation: false,
  },
  fixturesFolder: 'cypress/cypress-readonly/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 60000,
  screenshotsFolder: 'cypress/cypress-readonly/screenshots',
  video: true,
  videoCompression: 10,
  videoUploadOnPasses: false,
  videosFolder: 'cypress/cypress-readonly/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
