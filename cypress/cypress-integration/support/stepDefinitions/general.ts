import { Given } from '@badeball/cypress-cucumber-preprocessor';

Given('a clean session', () => {
  Cypress.session.clearCurrentSessionData();
  cy.task('deleteAllCypressTestAccounts');
});
