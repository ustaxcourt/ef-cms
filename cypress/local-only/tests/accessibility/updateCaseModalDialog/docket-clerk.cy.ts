import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Update Case Modal Dialog - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();

    cy.visit('/case-detail/102-19');
    cy.get('[data-testid="tab-case-information"]').click();
    cy.get('[data-testid="menu-edit-case-context-button"]').click();

    cy.runA11y();
  });
});
