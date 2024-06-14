import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsDocketClerk1 } from '../../../../helpers/authentication/login-as-helpers';

describe('Seal Docket Entry Modal - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk1();

    cy.visit('/case-detail/105-20');
    cy.get('[data-testid="docket-record-table"]');
    cy.get('[data-testid="seal-docket-entry-button-1"]').click();
    cy.get('[data-testid="seal-docket-entry-modal"]');

    checkA11y();
  });
});
