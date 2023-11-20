import 'cypress-file-upload';
import { getEnvironmentSpecificFunctions } from '../helpers/auth/environment-specific-factory';

const { login } = getEnvironmentSpecificFunctions();

Cypress.Commands.add('login', (username, route = '/') => {
  login(`${username}@example.com`, route);
  cy.window().then(win =>
    win.localStorage.setItem('__cypressOrderInSameTab', 'true'),
  );
});

before(() => {
  // Skip subsequent tests in spec when one fails.
  (cy.state('runnable').ctx as Mocha.Context).currentTest?.parent?.bail(true);
});
