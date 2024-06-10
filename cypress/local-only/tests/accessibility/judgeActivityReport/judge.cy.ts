import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';

describe('Judge Activity Report - Judge Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsColvin();
    cy.visit('/reports/judge-activity-report');
    cy.get('[data-testid="view-statistics-button"]').should('exist');

    cy.runA11y();
  });
});
