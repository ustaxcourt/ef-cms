import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Pending Report - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();

    cy.visit('/reports/pending-report');
    cy.get('[data-testid="pending-report-container"]');

    cy.runA11y();
  });
});
