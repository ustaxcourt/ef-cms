import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsIrsPractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Case Detail - IRS Practitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsIrsPractitioner();

    cy.visit('/case-detail/105-19');
    cy.get('[data-testid="docket-record-table"]').should('exist');

    checkA11y();
  });

  describe('Sealed cases', () => {
    it('should be free of a11y issues', () => {
      loginAsIrsPractitioner();

      cy.visit('/case-detail/102-20');
      cy.get('[data-testid="sealed-case-banner"]').should('exist');

      checkA11y();
    });
  });
});
