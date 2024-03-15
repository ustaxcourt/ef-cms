import { defineConfig } from 'cypress';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  defaultCommandTimeout: 60000,
  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on) {
      on('task', {});
    },
    specPattern: 'cypress/cypress-readonly/integration/*.cy.ts',
    supportFile: 'cypress/cypress-readonly/support/index.ts',
    testIsolation: false,
  },
  fixturesFolder: 'cypress/cypress-readonly/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 60000,
  screenshotOnRunFailure: false,
  screenshotsFolder: 'cypress/cypress-readonly/screenshots',
  video: true,
  videoCompression: 10,
  videosFolder: 'cypress/cypress-readonly/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
