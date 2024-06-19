import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Confirm Replace Petition Modal - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues for confirm replace petition modal', () => {
    loginAsPetitionsClerk();

    cy.visit('/case-detail/121-20/petition-qc');
    cy.contains('Petition').should('exist');
    cy.get('.remove-pdf-button').click();
    cy.get('.confirm-replace-petition-modal').should('exist');

    checkA11y();
  });
});
