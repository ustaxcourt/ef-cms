import { defineConfig } from 'cypress';

import {
  confirmUser,
  getRestApi,
  getUserToken,
} from './cypress/cypress-smoketests/support/login';

const { CYPRESS_SMOKETESTS_LOCAL } = process.env;

import {
  getRestApi as getRestApiLocal,
  getUserToken as getUserTokenLocal,
} from './cypress/cypress-smoketests/support/pages/local-login';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 20000,
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        confirmUser({ email }) {
          return confirmUser({ email });
        },
        getRestApi() {
          return CYPRESS_SMOKETESTS_LOCAL ? getRestApiLocal() : getRestApi();
        },
        getUserToken({ email, password }) {
          return CYPRESS_SMOKETESTS_LOCAL
            ? getUserTokenLocal(email)
            : getUserToken(email, password);
        },
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
    specPattern:
      'cypress/cypress-smoketests/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/cypress-smoketests/support/index.ts',
    testIsolation: false,
  },
  fixturesFolder: 'cypress/cypress-smoketests/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 20000,
  retries: 0,
  screenshotsFolder: 'cypress/cypress-smoketests/screenshots',
  video: true,
  videoCompression: 10,
  videoUploadOnPasses: false,
  videosFolder: 'cypress/cypress-smoketests/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
});
