// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { previousSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { previousSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

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
