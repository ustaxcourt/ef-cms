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
} from './cypress/helpers/cypressTasks/dynamo/dynamo-helpers';
import { parsePdf } from './cypress/helpers/cypressTasks/pdf/parsePdf';
import { overrideIdleTimeouts } from './cypress/local-only/support/idleLogoutHelpers';
import { unzipFile } from './cypress/helpers/file/unzip-file';
import { waitForNoce } from './cypress/helpers/cypressTasks/wait-for-noce';
import { waitForPractitionerEmailUpdate } from './cypress/helpers/cypressTasks/wait-for-practitioner-email-update';
import type { Page } from 'puppeteer-core';
import { retry, setup } from '@cypress/puppeteer';
import {
  toggleFeatureFlag,
} from './cypress/helpers/cypressTasks/postgres/featureFlagsCypress';

export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 60000,
  e2e: {
    baseUrl: 'http://localhost:1234',
    experimentalStudio: true,
    setupNodeEvents(on) {
      on('task', {
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
      // Setup for puppeteer, which supports multi-tab tests
      // Define your function in onMessage, and call it like cy.puppeteer('yourFunctionName', arg1, arg2 ...)
      setup({
        on,
        onMessage: {
          async closeTab(browser: any, url: string) {
            const desiredPage = await retry<Promise<Page>>(async () => {
              const pages = await browser.pages();
              const page = pages.find(p => p.url().includes(url));
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
