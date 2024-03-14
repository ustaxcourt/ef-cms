import { Before, Given, When } from '@badeball/cypress-cucumber-preprocessor';
import { cypressStateReset } from '../state';

Given('a clean session', () => {
  Cypress.session.clearCurrentSessionData();
  cy.task('deleteAllCypressTestAccounts');
  cypressStateReset();
});

When('I refresh the page', () => {
  cy.reload();
});

Before({ tags: '@mobile' }, () => {
  cy.viewport('iphone-6');
});
