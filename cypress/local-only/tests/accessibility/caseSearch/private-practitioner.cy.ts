import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Case Search, No Matches Page - Private Practitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPrivatePractitioner();
    cy.visit('/search/no-matches');
    cy.contains('No Matches Found');

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
