import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Docket Entry QC - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();

    cy.visit(
      '/case-detail/103-19/documents/dc2664a1-f552-418f-bcc7-8a67f4246568/edit',
    );
    cy.get('[data-testid="docket-entry-qc-container"]');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
      },
      terminalLog,
    );
  });

  describe('Work item already completed modal', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit(
        'http://localhost:1234/case-detail/320-21/documents/6b2bcbcc-bc95-4103-b5fd-3e999395c2d3/edit',
      );
      cy.get('[data-testid="work-item-already-completed-modal"]');

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
