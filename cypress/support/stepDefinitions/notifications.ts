import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('I should see an error that {string}', (expectedErrorText: string) => {
  cy.get('[data-testid="error-alert"]').should('contain', expectedErrorText);
});
