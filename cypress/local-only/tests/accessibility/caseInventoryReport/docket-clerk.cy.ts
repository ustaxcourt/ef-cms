import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Case Inventory Report - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();

    cy.visit('/reports/case-inventory-report');
    cy.get('[data-testid="case-inventory-report-modal"]');
    cy.get('[data-testid="case-inventory-status-select"]')
      .should('not.be.disabled')
      .select('New', { force: true });
    cy.get('[data-testid="case-inventory-judge-select"]')
      .should('not.be.disabled')
      .select('Chief Judge', { force: true });
    cy.get('[data-testid="modal-button-confirm"]').click();
    cy.get('[data-testid="case-inventory-report-table"]');

    checkA11y();
  });
});
