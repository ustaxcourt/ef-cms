import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Paper Filing - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();

    cy.visit('/case-detail/103-19/add-paper-filing');
    cy.get('[data-testid="paper-filing-container"]');

    cy.injectAxe();
    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
      },
      terminalLog,
    );
  });

  describe('Certificate of service date picker', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/case-detail/103-19/add-paper-filing');
      cy.get('[data-testid="paper-filing-container"]');
      cy.get('[data-testid="certificate-of-service-label"]').click();
      cy.get('[data-testid="service-date-picker"]');

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
});
