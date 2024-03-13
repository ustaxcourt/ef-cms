import { Before, Given, When } from '@badeball/cypress-cucumber-preprocessor';

Given('a clean session', () => {
  Cypress.session.clearCurrentSessionData();
  cy.task('deleteAllCypressTestAccounts');
});

When('I refresh the page', () => {
  cy.reload();
});

Before({ tags: '@mobile' }, () => {
  cy.viewport('iphone-6');
});
