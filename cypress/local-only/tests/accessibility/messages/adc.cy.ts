import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsAdc } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Messages - ADC Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('My messages tab', () => {
    describe('Inbox tab', () => {
      it('should be free of a11y issues', () => {
        loginAsAdc();

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
});
