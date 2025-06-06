import './commands';
import '@cypress/puppeteer/support';
import 'cypress-axe';

before(() => {
  // Skip subsequent tests in spec when one fails.
  (cy.state('runnable').ctx as Mocha.Context).currentTest.parent.bail(true);
});

beforeEach(() => {
  // This is used to intercept the dynamsoft javascript to prevent it from showing a modal
  // asking the user to download the dynamsoft software which causes the tests to break.
  // Due to race conditions, it's easier to just prevent dynamsoft from ever loading in smoketests
  // than it is to figure out how to always assume the modal will pop up (which sometimes it doesn't show)
  cy.intercept('GET', 'https://**/dynamsoft.webtwain.viewer.js**', {
    body: `window.Dynamsoft = {DWT: {
            CreateDWTObject() {}
          }}`,
    statusCode: 200,
  });
});
