import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsAdc } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Case Detail - ADC Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Docket record tab', () => {
    it('docket record - should be free of a11y issues', () => {
      loginAsAdc();

      cy.visit('/case-detail/101-19');
      cy.get('[data-testid="docket-number-header"]');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: { 'nested-interactive': { enabled: false } },
        },
        terminalLog,
      );
    });
  });
});
