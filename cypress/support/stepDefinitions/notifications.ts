import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('I should see an error that {string}', (expectedErrorText: string) => {
  cy.get('[data-testid="error-alert"]').should('contain', expectedErrorText);
});

Then('I should see a warning that {string}', (expectedWarningText: string) => {
  cy.get('[data-testid="warning-alert"]').should(
    'contain',
    expectedWarningText,
  );
});
