import {
  confirmUser,
  createAccount,
  deleteAllCypressTestAccounts,
  deleteAllIrsCypressTestAccounts,
  getIrsBearerToken,
} from './cypress/helpers/cypressTasks/cognito/cognito-helpers';
import { defineConfig } from 'cypress';
import {
  deleteAllItemsInEmailBucket,
  readAllItemsInBucket,
} from './cypress/deployed-and-local/support/email-receipt';
import {
  expireUserConfirmationCode,
  getEmailVerificationToken,
  getNewAccountVerificationCode,
} from './cypress/helpers/cypressTasks/dynamo/dynamo-helpers';
import { waitForNoce } from './cypress/helpers/cypressTasks/wait-for-noce';
import { waitForPractitionerEmailUpdate } from './cypress/helpers/cypressTasks/wait-for-practitioner-email-update';

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
        createAccount({
          irsEnv,
          password,
          role,
          userName,
        }: {
          irsEnv: boolean;
          password: string;
          role: string;
          userName: string;
        }) {
          return createAccount({
            isIrsEnv: irsEnv,
            password,
            role,
            userName,
          });
        },
        deleteAllCypressTestAccounts() {
          return deleteAllCypressTestAccounts();
        },
        deleteAllIrsCypressTestAccounts() {
          return deleteAllIrsCypressTestAccounts();
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
        expireUserConfirmationCode(email: string) {
          return expireUserConfirmationCode(email);
        },
        getEmailVerificationToken({ email }) {
          return getEmailVerificationToken({ email });
        },
        getIrsBearerToken({ password, userName }) {
          return getIrsBearerToken({
            password,
            userName,
          });
        },
        getNewAccountVerificationCode({ email }) {
          return getNewAccountVerificationCode({ email });
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

        waitForNoce({ docketNumber }: { docketNumber: string }) {
          return waitForNoce({ docketNumber });
        },
        waitForPractitionerEmailUpdate({
          docketNumber,
          practitionerEmail,
        }: {
          docketNumber: string;
          practitionerEmail: string;
        }) {
          return waitForPractitionerEmailUpdate({
            docketNumber,
            practitionerEmail,
          });
        },
      });
    },
    specPattern:
      'cypress/deployed-and-local/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/deployed-and-local/support/index.ts',
    testIsolation: false,
  },
  fixturesFolder: 'cypress/deployed-and-local/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 60000,
  retries: 0,
  screenshotOnRunFailure: false,
  screenshotsFolder: 'cypress/deployed-and-local/screenshots',
  video: true,
  videoCompression: 10,
  videosFolder: 'cypress/deployed-and-local/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
