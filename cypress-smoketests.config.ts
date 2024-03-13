import {
  confirmUser,
  deleteAllCypressTestAccounts,
  expireUserConfirmationCode,
  getNewAccountVerificationCode,
  getEmailVerificationToken,
} from './cypress/support/cognito-login';
import { defineConfig } from 'cypress';
import { waitForNoce } from './cypress/helpers/wait-for-noce';
import { waitForPractitionerEmailUpdate } from './cypress/helpers/wait-for-practitioner-email-update';
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 60000,
  e2e: {
    experimentalStudio: true,
    async setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {

      await addCucumberPreprocessorPlugin(on, config);

      on("file:preprocessor",
      createBundler({
        plugins: [createEsbuildPlugin(config)],
      }))

      on('task', {
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
        waitForNoce({ docketNumber }: { docketNumber: string }) {
          return waitForNoce({ docketNumber });
        },
        getEmailVerificationToken({ email }) {
          return getEmailVerificationToken({ email });
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

      return config;
    },
    specPattern:
      'cypress/cypress-smoketests/integration/**/*{.cy.ts,.feature}',
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
  screenshotOnRunFailure: false,
  screenshotsFolder: 'cypress/cypress-smoketests/screenshots',
  video: true,
  videoCompression: 10,
  videosFolder: 'cypress/cypress-smoketests/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
