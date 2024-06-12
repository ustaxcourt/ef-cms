import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

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

    checkA11y();
  });

  describe('Work item already completed modal', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit(
        'http://localhost:1234/case-detail/320-21/documents/6b2bcbcc-bc95-4103-b5fd-3e999395c2d3/edit',
      );
      cy.get('[data-testid="work-item-already-completed-modal"]');

      checkA11y();
    });
  });
});
