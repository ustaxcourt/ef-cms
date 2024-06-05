import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsFloater } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Dashboard - Floater Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsFloater();

    cy.injectAxe();
    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: { 'nested-interactive': { enabled: false } }, // https://github.com/flexion/ef-cms/issues/10396
      },
      terminalLog,
    );
  });
});
