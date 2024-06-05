import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Document QC - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Section', () => {
    describe('inbox tab', () => {
      it('should be free of a11y issues', () => {
        loginAsDocketClerk();

        cy.visit('/document-qc/section/inbox');
        cy.get('[data-testid="checkbox-assign-work-item"]').first().click();

        cy.runA11y();
      });
    });
  });
});
