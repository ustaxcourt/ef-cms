import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { navigateTo as loginAs } from '../../../support/pages/maintenance';

describe('Petitioner views dashboard', () => {
  it('should display filing fee column', () => {
    loginAs('petitioner');
    cy.get('[data-testid="case-list-table"]');
    cy.get('[data-testid="filing-fee"]');
    externalUserCreatesElectronicCase().then(docketNumber => {
      cy.get('[data-testid="filing-fee"]');
      cy.get(`[data-testid="${docketNumber}"]`)
        .find('[data-testid="petition-payment-status"]')
        .should('have.text', 'Not paid');
    });
  });
});
