import 'cypress-file-upload';

Cypress.Commands.add('showsErrorMessage', (shows = true) => {
  if (shows) {
    cy.get('.usa-alert-error').should('exist');
  } else {
    cy.get('.usa-alert-error').should('not.exist');
  }
});

Cypress.Commands.add('showsSpinner', (shows = true) => {
  if (shows) {
    cy.get('.progress-indicator').should('exist');
  } else {
    cy.get('.progress-indicator').should('not.exist');
  }
});

Cypress.Commands.add('showsSuccessMessage', (shows = true) => {
  if (shows) {
    cy.get('.usa-alert--success').should('exist');
  } else {
    cy.get('.usa-alert--success').should('not.exist');
  }
});

Cypress.Commands.add('login', (username, route = '/') => {
  const url = `/mock-login?token=${username}&path=${route}`;
  cy.visit(url);
  cy.url().should('include', route);
  cy.showsErrorMessage(false);
  cy.url().should('not.include', '/mock-login');
});

Cypress.Commands.add('goToRoute', (...args) => {
  cy.get('.progress-indicator').should('not.exist');
  return cy.window().then(w => {
    // eslint-disable-next-line no-underscore-dangle
    w.__cy_route(...args);
  });
});
