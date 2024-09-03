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
  getFeatureFlagValue,
  getNewAccountVerificationCode,
  toggleFeatureFlag,
} from './cypress/helpers/cypressTasks/dynamo/dynamo-helpers';
import { overrideIdleTimeouts } from './cypress/local-only/support/idleLogoutHelpers';
import { parsePdf } from './cypress/local-only/support/helpers.ts';
import { unzipFile } from './cypress/helpers/file/unzip-file';
import { waitForNoce } from './cypress/helpers/cypressTasks/wait-for-noce';
import { waitForPractitionerEmailUpdate } from './cypress/helpers/cypressTasks/wait-for-practitioner-email-update';

import type { Page } from 'puppeteer-core';

import { retry, setup } from '@cypress/puppeteer';

// eslint-disable-next-line import/no-default-export
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
        getFeatureFlagValue({ flag }) {
          return getFeatureFlagValue({ flag });
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
          async openExistingTabAndCheckSelectorExists(
            browser: any,
            url: string,
            selector: string,
            close: boolean = true,
          ) {
            // Note that browser.pages is *not* sorted in any particular order.
            // Therefore we pass in the URL we want to find rather than an index.

            // Wait until the new tab loads
            const desiredPage = await retry<Promise<Page>>(async () => {
              const pages = await browser.pages();
              const page = pages.find(p => p.url().includes(url));
              if (!page) throw new Error('Could not find page');
              return page;
            });

            // Activate it
            await desiredPage.bringToFront();

            // Make sure selector exists
            await desiredPage.waitForSelector(selector, { timeout: 30000 });

            if (close) {
              await desiredPage.close();
            }
            return true;
          },
          async openNewTab(
            browser: any,
            url: string,
            sessionModalTimeout: number,
            sessionTimeout: number,
          ) {
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });

            await page.evaluate(overrideIdleTimeouts, {
              sessionModalTimeout,
              sessionTimeout,
            });

            return page;
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
