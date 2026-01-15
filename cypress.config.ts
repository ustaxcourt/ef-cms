import {
  confirmUser,
  deleteAllCypressTestAccounts,
  getUserByEmail,
} from './cypress/helpers/cypressTasks/cognito/cognito-helpers';
import { defineConfig } from 'cypress';
import {
  deleteAllFilesInFolder,
  ensureFolderExists,
} from './cypress/local-only/support/database';
import {
  expireUserConfirmationCode,
  getEmailVerificationToken,
  getNewAccountVerificationCode,
} from './cypress/helpers/cypressTasks/postgres/postgres-helpers';
import { changeUserAccountStatus } from './cypress/helpers/cypressTasks/postgres/changeUserAccountStatus';
import { parsePdf } from './cypress/helpers/cypressTasks/pdf/parsePdf';
import { overrideIdleTimeouts } from './cypress/local-only/support/idleLogoutHelpers';
import { unzipFile } from './cypress/helpers/file/unzip-file';
import { waitForNoce } from './cypress/helpers/cypressTasks/wait-for-noce';
import type { Page } from 'puppeteer-core';
import { retry, setup } from '@cypress/puppeteer';
import { toggleFeatureFlag } from './cypress/helpers/cypressTasks/postgres/featureFlagsCypress';
import WebSocket from 'ws';
import { environment } from './web-api/src/environment';

export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 60000,
  e2e: {
    baseUrl: 'http://localhost:1234',
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
        deleteAllCypressTestAccounts() {
          return deleteAllCypressTestAccounts();
        },
        deleteAllFilesInFolder(dir) {
          return deleteAllFilesInFolder(dir);
        },
        ensureFolderExists(directory) {
          return ensureFolderExists(directory);
        },
        expireUserConfirmationCode(email: string) {
          return expireUserConfirmationCode(email);
        },
        getEmailVerificationToken({ email }) {
          return getEmailVerificationToken({ email });
        },
        getNewAccountVerificationCode({ email }) {
          return getNewAccountVerificationCode({ email });
        },
        changeUserAccountStatus({
          email,
          accountStatus,
        }: {
          email: string;
          accountStatus: string;
        }) {
          return changeUserAccountStatus({ email, accountStatus });
        },
        getUserByEmail(email: string) {
          return getUserByEmail(email);
        },
        parsePdf({ filePath }) {
          return parsePdf({ filePath });
        },
        table(message) {
          console.table(message);
          return null;
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
      // Setup for puppeteer, which supports multi-tab tests
      // Define your function in onMessage, and call it like cy.puppeteer('yourFunctionName', arg1, arg2 ...)
      setup({
        on,
        onMessage: {
          async closeTab(browser: any, url: string) {
            const desiredPage = await retry<Promise<Page>>(async () => {
              const pages = await browser.pages();
              const page = pages.find((p: Page) => p.url().includes(url));
              if (!page) throw new Error('Could not find page');
              return page;
            });
            await desiredPage.close();
          },
          async openNewTab(
            browser: any,
            url: string,
            areYouStillThereTime: number,
            sessionTimeout: number,
          ) {
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });

            await page.evaluate(overrideIdleTimeouts, {
              areYouStillThereTime,
              sessionTimeout,
            });

            return page;
          },
          async verifyAllTabsAreOnIdleLogout(
            browser: any,
            close: boolean = true,
          ) {
            // We must retry this call as the pages are sometimes not fully loaded.
            await retry(
              async () => {
                // Note that browser.pages is *not* sorted in any particular order.
                const pages: Page[] = await browser.pages();
                for (const page of pages) {
                  if (page.url().includes('.cy.ts')) {
                    continue;
                  }

                  await page.bringToFront();

                  if (!page.url().includes('/idle-logout')) {
                    throw new Error('Page is not on idle logout screen!');
                  }

                  if (close) {
                    await page.close();
                  }
                }
              },
              { delayBetweenTries: 1000, timeout: 30000 },
            );

            return true;
          },
        },
      });
    },
    specPattern: 'cypress/local-only/tests/**/*.cy.ts',
    supportFile: 'cypress/local-only/support/index.ts',
    testIsolation: false,
  },
  fixturesFolder: 'cypress/local-only/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 60000,
  retries: 0,
  screenshotOnRunFailure: false,
  screenshotsFolder: 'cypress/local-only/screenshots',
  video: true,
  videosFolder: 'cypress/local-only/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
