import { defineConfig } from 'cypress';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  defaultCommandTimeout: 60000,
  e2e: {
    baseUrl: 'http://localhost:1234',
    experimentalStudio: true,
    setupNodeEvents(on) {
      on('task', {
        log(message) {
          console.log(message);

          return null;
        },
        table(message) {
          console.table(message);

          return null;
        },
      });
    },
    specPattern: 'cypress/accessibility/integration/**/*.cy.ts',
    supportFile: 'cypress/accessibility/support/index.ts',
    testIsolation: false,
  },
  fixturesFolder: 'cypress/accessibility/fixtures',
  reporter: 'spec',
  reporterOptions: {
    toConsole: true,
  },
  requestTimeout: 60000,
  screenshotOnRunFailure: false,
  screenshotsFolder: 'cypress/accessibility/screenshots',
  video: true,
  videoCompression: 10,
  videosFolder: 'cypress/accessibility/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
  watchForFileChanges: false,
});
