import {
  confirmUser,
  getUserTokenWithRetry,
} from './cypress/support/cognito-login';
import { defineConfig } from 'cypress';
import { getUserToken as getUserTokenLocal } from './cypress/helpers/auth/local-login';
import { waitForNoce } from './cypress/cypress-smoketests/support/wait-for-noce';
import {
  deleteAllItemsInEmailBucket,
  readAllItemsInBucket,
} from './cypress/cypress-smoketests/support/email-receipt';
const { CYPRESS_SMOKETESTS_LOCAL } = process.env;

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 60000,
  e2e: {
    experimentalStudio: true,
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
        deleteAllItemsInEmailBucket({
          bucketName,
          retries,
        }: {
          bucketName: string;
          retries: number;
        }) {
          return deleteAllItemsInEmailBucket({ bucketName, retries });
        },
        readAllItemsInBucket({
          bucketName,
          retries,
        }: {
          bucketName: string;
          retries: number;
        }) {
          return readAllItemsInBucket({ bucketName, retries });
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
  videosFolder: 'cypress/cypress-smoketests/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
