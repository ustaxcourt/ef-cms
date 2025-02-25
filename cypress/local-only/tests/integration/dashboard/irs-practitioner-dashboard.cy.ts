import { navigateTo as loginAs } from '../../../support/pages/maintenance';

describe('IRS practitioner views dashboard', () => {
  it('should NOT have a column for filing fee in the case list table', () => {
    loginAs('irspractitioner');
    cy.get('[data-testid="case-list-table"]');
    cy.get('[data-testid="filing-fee"]').should('not.exist');
    cy.get('[data-testid="petition-payment-status"]').should('not.exist');
  });

  it('should NOT display the "Create a Case" button', () => {
    cy.viewport('iphone-5');

    loginAs('irspractitioner');
    cy.get('[data-testid="additional-case-select"]').should('exist');
    cy.get('[data-testid="file-a-petition"]').should('not.exist');
  });
});
