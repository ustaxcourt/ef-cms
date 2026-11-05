import { defineConfig } from 'cypress';
import { getExposedCypressEnv } from './cypress/helpers/env/exposedCypressEnv';
import {
  getEmailVerificationToken,
  getOpenAndRecentCasesByEmail,
  getPractionerWithMostCasesEmail,
  getRecentEventsByCode,
} from './cypress/helpers/cypressTasks/postgres/postgres-helpers';
import { getUserByEmail } from './cypress/helpers/cypressTasks/cognito/cognito-helpers';

export default defineConfig({
  chromeWebSecurity: true,
  defaultCommandTimeout: 60000,
  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on) {
      on('task', {
        getEmailVerificationToken({ email }) {
          return getEmailVerificationToken({ email });
        },

        getPractionerWithMostCasesEmail() {
          return getPractionerWithMostCasesEmail();
        },
        getOpenAndRecentCasesByEmail(email: string) {
          return getOpenAndRecentCasesByEmail(email);
        },
        getRecentEventsByCode({
          eventCode,
          cases,
          dateStart,
        }: {
          eventCode: string;
          cases: string[];
          dateStart: string;
        }) {
          return getRecentEventsByCode(eventCode, cases, dateStart);
        },
        getUserByEmail(email: string) {
          return getUserByEmail(email);
        },
      });
    },
    specPattern: 'cypress/real-users/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/real-users/support/index.ts',
    testIsolation: false,
  },
  expose: getExposedCypressEnv(),
  fixturesFolder: 'cypress/helpers/file',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 60000,
  retries: 0,
  screenshotOnRunFailure: false,
  screenshotsFolder: 'cypress/real-users/screenshots',
  video: true,
  videoCompression: 10,
  videosFolder: 'cypress/real-users/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
