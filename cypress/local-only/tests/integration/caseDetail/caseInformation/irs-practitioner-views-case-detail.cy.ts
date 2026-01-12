import { loginAsIrsPractitioner } from 'cypress/helpers/authentication/login-as-helpers';
import { getCaseDetailTab } from '../../../../support/pages/case-detail';

describe('IRS Practitioner views case detail', () => {
  it('should NOT display filing fee information', () => {
    loginAsIrsPractitioner();
    cy.visit('/case-detail/101-19');
    getCaseDetailTab('case-information').click();
    cy.get('[data-testid="filling-fee-message"]').should('not.exist');
  });
});
