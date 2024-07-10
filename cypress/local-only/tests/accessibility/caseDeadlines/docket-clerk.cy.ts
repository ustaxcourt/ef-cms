import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Case Deadlines - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();

    cy.visit('/reports/case-deadlines');
    cy.get('#deadlineStart-date-start').type('01/01/2019');
    cy.get('#deadlineEnd-date-end').type('12/01/2019');
    cy.get('[data-testid="submit-case-deadlines-report-button"]').click();

    checkA11y();
  });
});
