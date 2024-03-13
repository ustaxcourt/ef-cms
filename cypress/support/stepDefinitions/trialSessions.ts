import { When } from '@badeball/cypress-cucumber-preprocessor';

When('I visit the trial sessions page', () => {
  cy.visit('/trial-sessions');
});
