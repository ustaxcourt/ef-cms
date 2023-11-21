import { navigateTo as loginAs } from '../support/pages/maintenance';

describe('IRS practitioner views dashboard', () => {
  it('should NOT have a column for filing fee in the case list table', () => {
    loginAs('irspractitioner');
    cy.getByTestId('case-list');
    cy.getByTestId('filing-fee').should('not.exist');
    cy.getByTestId('petition-payment-status').should('not.exist');
  });
});
