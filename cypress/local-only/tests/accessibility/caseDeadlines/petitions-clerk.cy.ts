import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Case Deadlines Report - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitionsClerk();
    cy.visit('/reports/case-deadlines');
    cy.get('[data-testid="deadlineStart-date-start-input"]').should('exist');

    checkA11y();
  });
});
