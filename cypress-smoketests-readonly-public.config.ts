import { defineConfig } from 'cypress';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  defaultCommandTimeout: 20000,
  e2e: {
    specPattern: 'cypress/readonly/integration/public/*.cy.ts',
    supportFile: 'cypress/readonly/support/index.ts',
    testIsolation: false,
  },
  fixturesFolder: 'cypress/readonly/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 20000,
  screenshotOnRunFailure: false,
  screenshotsFolder: 'cypress/readonly/screenshots',
  video: true,
  videoCompression: 10,
  videosFolder: 'cypress/readonly/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
