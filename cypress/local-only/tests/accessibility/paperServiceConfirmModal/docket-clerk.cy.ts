import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Paper Service Confirm Modal - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();
    cy.visit(
      '/case-detail/101-24/documents/077bd89c-95da-4579-9e8e-6f32b3bc7964/edit?fromPage=case-detail',
    );
    cy.get('#save-and-finish').click();
    cy.get('[data-testid="modal-confirm"]').should('exist');

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
