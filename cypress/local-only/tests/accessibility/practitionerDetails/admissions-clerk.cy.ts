import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsAdmissionsClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Practitioner Details - Admissions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Practitioner documentation tab', () => {
    it('should be free of a11y issues', () => {
      loginAsAdmissionsClerk();

      cy.visit('/practitioner-detail/PT1234?tab=practitioner-documentation');
      cy.get('[data-testid="add-practitioner-document-button"]');

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
