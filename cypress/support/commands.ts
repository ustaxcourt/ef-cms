import 'cypress-file-upload';
import { getEnvironmentSpecificFunctions } from '../helpers/auth/environment-specific-factory';

const { login } = getEnvironmentSpecificFunctions();

Cypress.Commands.add('login', (username, route = '/') => {
  login(`${username}@example.com`, route);
  cy.window().then(win =>
    win.localStorage.setItem('__cypressOrderInSameTab', 'true'),
  );
  cy.intercept('GET', 'https://**/dynamsoft.webtwain.initiate.js', {
    body: `window.Dynamsoft = {DWT: {
            GetWebTwain() {}
          }}`,
    statusCode: 200,
  });
});

before(() => {
  // Skip subsequent tests in spec when one fails.
  (cy.state('runnable').ctx as Mocha.Context).currentTest?.parent?.bail(true);
});
