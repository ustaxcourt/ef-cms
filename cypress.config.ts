import { defineConfig } from 'cypress';
import { expireForgotPasswordCode, getEmailVerificationToken, getForgotPasswordCode } from './cypress/cypress-integration/support/database';
import {
  confirmUser,
  deleteAllCypressTestAccounts,
  expireUserConfirmationCode,
  getCognitoUserIdByEmail,
  getNewAccountVerificationCode,
  getUserTokenWithRetry,
} from './cypress/support/cognito-login';
import { getUserToken as getUserTokenLocal } from './cypress/helpers/auth/local-login';
import { waitForNoce } from './cypress/cypress-smoketests/support/wait-for-noce';
const { CYPRESS_SMOKETESTS_LOCAL } = process.env;

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
        confirmUser({ email }) {
          return confirmUser({ email });
        },
        deleteAllCypressTestAccounts() {
          return deleteAllCypressTestAccounts();
        },
        expireUserConfirmationCode(email: string) {
          return expireUserConfirmationCode(email);
        },
        getNewAccountVerificationCode({ email }) {
          return getNewAccountVerificationCode({ email });
        },
        getForgotPasswordCode({ email }) {
          return getForgotPasswordCode({ email });
        },
        getUserToken({ email, password }) {
          return CYPRESS_SMOKETESTS_LOCAL
            ? getUserTokenLocal(email)
            : getUserTokenWithRetry(email, password);
        },
        expireForgotPasswordCode({ email }) {
          return expireForgotPasswordCode({ email });
        },
        waitForNoce({ docketNumber }: { docketNumber: string }) {
          return waitForNoce({ docketNumber });
        },
      });
    },
    specPattern: 'cypress/cypress-integration/integration/**/*.cy.ts',
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
  screenshotOnRunFailure: false,
  screenshotsFolder: 'cypress/cypress-integration/screenshots',
  video: true,
  videosFolder: 'cypress/cypress-integration/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});

