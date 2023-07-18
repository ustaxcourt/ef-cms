import {
  confirmUser,
  getUserTokenWithRetry,
} from './cypress/support/cognito-login';
import { defineConfig } from 'cypress';
import { waitForNoce } from './cypress/cypress-smoketests-after-color-switch/support/wait-for-noce';

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
          return getUserTokenWithRetry(email, password);
        },
        waitForNoce({ docketNumber }: { docketNumber: string }) {
          return waitForNoce({ docketNumber });
        },
      });
    },
    specPattern:
      'cypress/cypress-smoketests-after-color-switch/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile:
      'cypress/cypress-smoketests-after-color-switch/support/index.ts',
    testIsolation: false,
  },
  fixturesFolder: 'cypress/cypress-smoketests-after-color-switch/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 60000,
  retries: 0,
  screenshotsFolder:
    'cypress/cypress-smoketests-after-color-switch/screenshots',
  video: true,
  videoCompression: 10,
  videoUploadOnPasses: false,
  videosFolder: 'cypress/cypress-smoketests-after-color-switch/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
