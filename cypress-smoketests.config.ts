import {
  confirmUser,
  createAccount,
  deleteAllCypressTestAccounts,
  deleteAllIrsCypressTestAccounts,
  getIrsBearerToken,
  getUserByEmail,
} from './cypress/helpers/cypressTasks/cognito/cognito-helpers';
import { defineConfig } from 'cypress';
import {
  deleteAllItemsInEmailBucket,
  readAllItemsInBucket,
} from './cypress/deployed-and-local/support/email-receipt';
import {
  ensureFolderExists,
  fileExists,
} from './cypress/local-only/support/database';
import {
  getFeatureFlagValue,
  getRawFeatureFlagValue,
  toggleFeatureFlag,
} from './cypress/helpers/cypressTasks/dynamo/dynamo-helpers';
import {
  expireUserConfirmationCode,
  getEmailVerificationToken,
  getNewAccountVerificationCode,
} from './cypress/helpers/cypressTasks/postgres/postgres-helpers';
import { unzipFile } from './cypress/helpers/file/unzip-file';
import { waitForNoce } from './cypress/helpers/cypressTasks/wait-for-noce';

export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 60000,
  e2e: {
    experimentalStudio: true,
    // Enable experimental features for better performance
    experimentalModifyObstructiveThirdPartyCode: true,
    setupNodeEvents(on) {
      on('task', {
        confirmUser({ email }) {
          return confirmUser({ email });
        },
        createAccount({
          isIrsEnv,
          name,
          password,
          role,
          userId,
          userName,
        }: {
          userName: string;
          password: string;
          role: string;
          isIrsEnv: boolean;
          name: string;
          userId: string;
        }) {
          return createAccount({
            isIrsEnv,
            name,
            password,
            role,
            userId,
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
        ensureFolderExists(directory) {
          return ensureFolderExists(directory);
        },
        expireUserConfirmationCode(email: string) {
          return expireUserConfirmationCode(email);
        },
        fileExists(filePath) {
          return fileExists(filePath);
        },
        getEmailVerificationToken({ email }) {
          return getEmailVerificationToken({ email });
        },
        getFeatureFlagValue({ flag }) {
          return getFeatureFlagValue({ flag });
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
        getRawFeatureFlagValue({ flag }) {
          return getRawFeatureFlagValue({ flag });
        },
        getUserByEmail(email: string) {
          return getUserByEmail(email);
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
        toggleFeatureFlag(args) {
          return toggleFeatureFlag(args);
        },
        unzipFile({ fileName }) {
          return unzipFile({ fileName });
        },
        waitForNoce({ docketNumber }: { docketNumber: string }) {
          return waitForNoce({ docketNumber });
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
  videoCompression: 32, // Increased from 10 for faster video processing
  videosFolder: 'cypress/deployed-and-local/videos',
  viewportHeight: 768, // Reduced from 900 for faster rendering
  viewportWidth: 1024, // Reduced from 1200 for faster rendering
  watchForFileChanges: false,
});
