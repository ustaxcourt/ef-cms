import { navigateTo as loginAs } from '../../../support/pages/maintenance';

describe('DOJ practitioner views dashboard', () => {
  it('should NOT display the "Create a Case" button', () => {
    cy.viewport('iphone-5');

    loginAs('dojpractitioner1');
    cy.get('[data-testid="additional-case-select"]').should('exist');
    cy.get('[data-testid="file-a-petition"]').should('not.exist');
  });
});
