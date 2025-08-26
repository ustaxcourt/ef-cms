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
import cypressFailFast from 'cypress-fail-fast/plugin.js';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 60000,
  env: {
    FAIL_FAST_STRATEGY: 'parallel',
    FAIL_FAST_ENABLED: true,
    FAIL_FAST_PLUGIN: true,
    FAIL_FAST_BAIL: 1,
  },
  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // Flag file for parallel fail-fast communication
      const isCancelledFlagFile = path.resolve(__dirname, '.run-is-cancelled');

      cypressFailFast(on, config, {
        parallelCallbacks: {
          onCancel: () => {
            // Create flag file when the plugin starts skipping tests
            fs.writeFileSync(isCancelledFlagFile, '');
          },
          isCancelled: () => {
            // If any other run has created the file, start skipping tests
            return fs.existsSync(isCancelledFlagFile);
          },
        },
      });
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
  videoCompression: 10,
  videosFolder: 'cypress/deployed-and-local/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
