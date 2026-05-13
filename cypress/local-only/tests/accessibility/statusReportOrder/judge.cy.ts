import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';

describe('Status Report Order - Judge Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsColvin();
    cy.visit(
      '/case-detail/102-67/documents/7be2dea1-4428-4917-a66d-0d474e57ee02/status-report-order-create?statusReportFilingDate=2024-06-28&statusReportIndex=1',
    );
    cy.get('[data-testid="save-draft-button"]').should('exist');
    cy.get('#additional-order-text-array-0').type('First accessible clause');
    cy.contains('button', 'Add additional order text').click();
    cy.get('#additional-order-text-array-1').type('Second accessible clause');

    checkA11y();
  });
});
