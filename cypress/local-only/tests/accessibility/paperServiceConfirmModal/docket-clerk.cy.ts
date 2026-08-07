import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Paper Service Confirm Modal - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();
    cy.visit('/case-detail/101-24?openModal=PaperServiceConfirmModal');
    cy.get('[data-testid="docket-record-table"]');
    cy.get('[data-testid="modal-confirm"]').should('exist');

    checkA11y();
  });
});
