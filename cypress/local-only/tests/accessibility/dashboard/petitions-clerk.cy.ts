import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Dashboard Page - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitionsClerk();

    cy.injectAxe();
    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: { 'nested-interactive': { enabled: false } }, // TODO LINK
      },
      terminalLog,
    );
  });
});
