import './commands';
import '@cypress/puppeteer/support';
import 'cypress-axe';
import { mockDynamsoftLibrary } from 'cypress/helpers/authentication/dynamsoft';

before(() => {
  // Skip subsequent tests in spec when one fails.
  (cy.state('runnable').ctx as Mocha.Context).currentTest.parent.bail(true);
});

beforeEach(() => {
  mockDynamsoftLibrary();
});
