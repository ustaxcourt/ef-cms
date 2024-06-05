import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Upload Court Issued Document - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();

    cy.visit('/case-detail/104-20/upload-court-issued');
    cy.get('[data-testid="upload-court-issued-document-form"]');

    cy.runA11y();
  });
});
