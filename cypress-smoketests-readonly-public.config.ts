import { defineConfig } from 'cypress';
import { assertCorrectNetworkData } from './cypress/helpers/cypressTasks/network/assertCorrectNetworkData';
import { getExposedCypressEnv } from './cypress/helpers/env/exposedCypressEnv';

export default defineConfig({
  defaultCommandTimeout: 60000,
  e2e: {
    specPattern: 'cypress/readonly/integration/public/*.cy.ts',
    setupNodeEvents(on) {
      on('task', {
        assertCorrectNetworkData(payloads) {
          return assertCorrectNetworkData(payloads);
        },
      });
    },
    supportFile: 'cypress/readonly/support/index.ts',
    testIsolation: false,
  },
  expose: getExposedCypressEnv(),
  fixturesFolder: 'cypress/readonly/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 60000,
  screenshotOnRunFailure: false,
  screenshotsFolder: 'cypress/readonly/screenshots',
  video: true,
  videoCompression: 10,
  videosFolder: 'cypress/readonly/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
