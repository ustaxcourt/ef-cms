import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsAdc } from '../../../../helpers/authentication/login-as-helpers';

describe('Case Detail - ADC Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Docket record tab', () => {
    it('docket record - should be free of a11y issues', () => {
      loginAsAdc();

      cy.visit('/case-detail/101-19');
      cy.get('[data-testid="docket-number-header"]');

      checkA11y();
    });
  });
});
