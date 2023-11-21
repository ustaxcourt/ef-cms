import { navigateTo as loginAs } from '../support/pages/maintenance';
import { petitionerCreatesACase } from '../support/setup/petitioner-creates-a-case';

describe('Petitioner views dashboard', () => {
  it('should display filing fee column', () => {
    loginAs('petitioner');
    cy.get('[data-testid="case-list-table"]');
    cy.get('[data-testid="filing-fee"]');
    petitionerCreatesACase().then(docketNumber => {
      cy.get('[data-testid="filing-fee"]');
      cy.get(`[data-testid="${docketNumber}"]`)
        .find('[data-testid="petition-payment-status"]')
        .should('have.text', 'Not paid');
    });
  });
});
