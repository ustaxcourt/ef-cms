import 'cypress-file-upload';

Cypress.Commands.add('login', (username, route = '/') => {
  Cypress.session.clearCurrentSessionData();
  cy.window().then(win =>
    win.localStorage.setItem('__cypressOrderInSameTab', 'true'),
  );
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(`${username}@example.com`);
  cy.get('[data-testid="password-input"]').type('Testing1234$', { log: false });
  cy.get('[data-testid="login-button"]').click();
  cy.get('[data-testid="account-menu-button"]');
  cy.visit(route);
  cy.intercept('GET', 'https://**/dynamsoft.webtwain.initiate.js', {
    body: `window.Dynamsoft = {DWT: {
            GetWebTwain() {}
          }}`,
    statusCode: 200,
  });
});

Cypress.Commands.add('goToRoute', (...args) => {
  cy.get('.progress-indicator').should('not.exist');
  return cy.window().then(w => {
    // eslint-disable-next-line no-underscore-dangle
    w.__cy_route(...args);
  });
});

before(() => {
  // Skip subsequent tests in spec when one fails.
  (cy.state('runnable').ctx as Mocha.Context).currentTest?.parent?.bail(true);
});
