import './commands';
import '@cypress/puppeteer/support';
import 'cypress-axe';

before(() => {
  // Skip subsequent tests in spec when one fails.
  (cy.state('runnable').ctx as Mocha.Context).currentTest.parent.bail(true);
});
