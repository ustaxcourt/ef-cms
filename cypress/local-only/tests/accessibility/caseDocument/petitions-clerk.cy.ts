import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Case Documents Page - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitionsClerk();
    cy.visit(
      '/case-detail/104-19/documents/c63be3f2-2240-451e-b6bd-8206d52a070b/review',
    );
    cy.get('#file-a-document-header').should('exist');

    checkA11y();
  });
});
