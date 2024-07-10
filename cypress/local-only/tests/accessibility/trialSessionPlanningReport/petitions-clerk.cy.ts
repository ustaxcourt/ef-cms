import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Trial Session Planning Report - Petition Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitionsClerk();
    cy.visit('/search');
    cy.get('#reports-btn').click();
    cy.get('#trial-session-planning-btn').click();
    cy.get('.trial-session-planning-modal').should('exist');

    checkA11y();
  });
});
