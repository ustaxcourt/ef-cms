import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Unconsolidate Cases Modal - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();

    cy.visit('/case-detail/111-19');
    cy.get('[data-testid="docket-record-table"]');
    cy.get('[data-testid="tab-case-information"]').click();
    cy.get('[data-testid="unconsolidate-cases-button"]').click();
    cy.get('[data-testid="modal-confirm"]');

    checkA11y();
  });
});
