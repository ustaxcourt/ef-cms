import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Case Inventory Report - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();

    cy.visit('/reports/case-inventory-report');
    cy.get('[data-testid="case-inventory-report-modal"]');
    cy.get('[data-testid="case-inventory-status-select"]').select('New');
    cy.get('[data-testid="case-inventory-judge-select"]')
      .should('be.enabled')
      .select('Chief Judge');
    cy.get('[data-testid="modal-button-confirm"]').click();
    cy.get('[data-testid="case-inventory-report-table"]');

    cy.runA11y();
  });
});
