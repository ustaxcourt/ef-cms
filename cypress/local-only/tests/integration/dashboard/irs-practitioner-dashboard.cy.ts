import {
  login,
  loginAsIrsPractitioner,
} from 'cypress/helpers/authentication/login-as-helpers';

describe('IRS practitioner views dashboard', () => {
  it('should NOT have a column for filing fee in the case list table', () => {
    loginAsIrsPractitioner();
    cy.get('[data-testid="case-list-table"]');
    cy.get('[data-testid="filing-fee"]').should('not.exist');
    cy.get('[data-testid="petition-payment-status"]').should('not.exist');
  });

  it('should NOT display the "Create a Case" button', () => {
    cy.viewport('iphone-5');

    login({ email: 'irsPractitioner@example.com' });
    cy.get('[data-testid="additional-case-select"]').should('exist');
    cy.get('[data-testid="file-a-petition"]').should('not.exist');
  });
});
