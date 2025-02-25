import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Private practitioner views dashboard', () => {
  it('should display filing fee column', () => {
    loginAsPrivatePractitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      cy.get('[data-testid="case-list-table"]');
      cy.get('[data-testid="filing-fee"]');

      cy.get('[data-testid="filing-fee"]');
      cy.get(`[data-testid="${docketNumber}"]`)
        .find('[data-testid="petition-payment-status"]')
        .should('have.text', 'Not paid');
    });
  });
});
