import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Edit Petitioner Information - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('when party is a petitioner', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit(
        '/case-detail/999-15/edit-petitioner-information/7805d1ab-18d0-43ec-bafb-654e83405416',
      );
      cy.get('[data-testid="edit-petitioner-contact-type-select"]');

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

  describe('when party is an intervenor', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit(
        '/case-detail/999-15/edit-petitioner-information/89d7d182-46da-4b96-b29b-260d15249c25',
      );
      cy.get('[data-testid="edit-petitioner-contact-type-select"]');

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
