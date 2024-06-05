import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsReportersOffice } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Dashboard Page - Reporters Office Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsReportersOffice();

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
