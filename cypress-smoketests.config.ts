import {
  confirmUser,
  getUserTokenWithRetry,
} from './cypress/cypress-smoketests/support/login';
import { defineConfig } from 'cypress';
import { waitForNoce } from './cypress/cypress-smoketests/support/wait-for-noce';
const { CYPRESS_SMOKETESTS_LOCAL } = process.env;

import { getUserToken as getUserTokenLocal } from './cypress/cypress-smoketests/support/pages/local-login';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 60000,
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        confirmUser({ email }) {
          return confirmUser({ email });
        },
        getUserToken({ email, password }) {
          return CYPRESS_SMOKETESTS_LOCAL
            ? getUserTokenLocal(email)
            : getUserTokenWithRetry(email, password);
        },
        waitForNoce({ docketNumber }: { docketNumber: string }) {
          return waitForNoce({ docketNumber });
        },
      });
    },
    specPattern:
      'cypress/cypress-smoketests/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/cypress-smoketests/support/index.ts',
    testIsolation: false,
  },
  fixturesFolder: 'cypress/cypress-smoketests/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 60000,
  retries: 0,
  screenshotsFolder: 'cypress/cypress-smoketests/screenshots',
  video: true,
  videoCompression: 10,
  videoUploadOnPasses: false,
  videosFolder: 'cypress/cypress-smoketests/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
