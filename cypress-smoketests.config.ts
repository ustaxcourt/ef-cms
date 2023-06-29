import { defineConfig } from 'cypress';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 60000,
  e2e: {
    setupNodeEvents(on) {
      on('task', {
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
  requestTimeout: 60000,
  retries: 4,
  screenshotsFolder: 'cypress/cypress-smoketests/screenshots',
  video: true,
  videoCompression: 10,
  videoUploadOnPasses: false,
  videosFolder: 'cypress/cypress-smoketests/videos',
  viewportHeight: 900,
  viewportWidth: 1200,
});
