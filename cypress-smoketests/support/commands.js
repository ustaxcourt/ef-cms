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

// https://github.com/cypress-io/cypress/issues/170
// Usage: cy.upload_file('building.jpg', '#building [type="file"]');
Cypress.Commands.add('upload_file', (fileName, selector, contentType) => {
  cy.get(selector).then(subject => {
    cy.fixture(fileName, 'base64').then(content => {
      cy.window().then(win => {
        const el = subject[0];
        const blob = b64toBlob(content, contentType);
        const testFile = new win.File([blob], fileName, {
          type: contentType,
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        el.files = dataTransfer.files;
        if (subject.is(':visible')) {
          return cy.wrap(subject).trigger('change', { force: true });
        } else {
          return cy.wrap(subject);
        }
      });
    });
  });
});
