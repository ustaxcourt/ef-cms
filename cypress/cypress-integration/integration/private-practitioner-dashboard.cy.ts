import { loginAsPrivatePractitioner } from '../../helpers/auth/login-as-helpers';
import { practitionerCreatesElectronicCase } from '../../helpers/practitioner-creates-electronic-case';

describe('Private practitioner views dashboard', () => {
  it('should display filing fee column', () => {
    loginAsPrivatePractitioner();
    practitionerCreatesElectronicCase().then(docketNumber => {
      cy.get('[data-testid="case-list-table"]');
      cy.get('[data-testid="filing-fee"]');

      cy.get('[data-testid="filing-fee"]');
      cy.get(`[data-testid="${docketNumber}"]`)
        .find('[data-testid="petition-payment-status"]')
        .should('have.text', 'Not paid');
    });
  });
});
