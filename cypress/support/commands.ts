import 'cypress-file-upload';

Cypress.Commands.add('login', (username, route = '/') => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(`${username}@example.com`);
  cy.get('[data-testid="password-input"]').type('Testing1234$', { log: false });
  cy.get('[data-testid="login-button"]').click();
  cy.get('[data-testid="account-menu-button"]');
  cy.visit(route);
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
