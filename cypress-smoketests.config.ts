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
  getRawFeatureFlagValue,
  toggleFeatureFlag,
} from './cypress/helpers/cypressTasks/postgres/featureFlagsCypress';
import {
  expireUserConfirmationCode,
  getEmailVerificationToken,
  getNewAccountVerificationCode,
} from './cypress/helpers/cypressTasks/postgres/postgres-helpers';
import { unzipFile } from './cypress/helpers/file/unzip-file';
import { waitForNoce } from './cypress/helpers/cypressTasks/wait-for-noce';
import WebSocket from 'ws';
import { environment } from './web-api/src/environment';

export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 60000,
  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on) {
      let wsClient: WebSocket | undefined;
      const messageQueue: any[] = [];

      on('task', {
        connectWebSocket({ token, clientConnectionId }: { token: string; clientConnectionId: string }) {
          return new Promise((resolve, reject) => {
            const host = environment.wsEndpoint.replace(/^https?:\/\//, '');
            const protocol = host.startsWith('localhost') ? 'ws' : 'wss';
            const wsUrl = `${protocol}://${host}/?token=${token}&clientConnectionId=${clientConnectionId}`;
            wsClient = new WebSocket(wsUrl);
            
            wsClient.on('open', () => {
              console.log(`WebSocket connected to ${wsUrl}`);
              resolve(true);
            });

            wsClient.on('message', (data: string | Buffer) => {
              try {
                const message = JSON.parse(data.toString());
                console.log('WebSocket message received:', message);
                messageQueue.push(message);
              } catch (e) {
                console.error('Failed to parse WebSocket message:', e);
              }
            });

            wsClient.on('error', (error) => {
              console.error('WebSocket error:', error);
              reject(error);
            });

            wsClient.on('close', () => {
              console.log('WebSocket connection closed');
            });
          });
        },
        waitForWebSocketMessage({ action, timeout = 15000 }: { action: string; timeout?: number }) {
          return new Promise((resolve, reject) => {
            const startTime = performance.now();
            
            const checkQueue = () => {
              const messageIndex = messageQueue.findIndex(m => m.action === action);
              if (messageIndex !== -1) {
                const message = messageQueue[messageIndex];
                messageQueue.splice(messageIndex, 1);
                console.log(`Found WebSocket message with action: ${action}`, message);
                resolve(message);
              } else if (performance.now() - startTime > timeout) {
                reject(new Error(`Timeout waiting for WebSocket message with action: ${action}. Queue: ${JSON.stringify(messageQueue)}`));
              } else {
                setTimeout(checkQueue, 100);
              }
            };

            checkQueue();
          });
        },
        disconnectWebSocket() {
          if (wsClient) {
            wsClient.close();
            wsClient = undefined;
            messageQueue.length = 0;
            console.log('WebSocket disconnected and queue cleared');
          }
          return null;
        },
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
