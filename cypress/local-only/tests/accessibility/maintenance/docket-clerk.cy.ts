import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsDocketClerk1 } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Maintenance - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk1();

    cy.visit('/maintenance');
    cy.get('[data-testid="maintenance-container"]');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
      },
      terminalLog,
    );
  });
});
