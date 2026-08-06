import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsCaseServicesSupervisor } from '../../../../helpers/authentication/login-as-helpers';

describe('Docket Clerk Report - Case Services Supervisor Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsCaseServicesSupervisor();

    cy.visit('/reports/docket-clerk-report');
    cy.get('[data-testid="docket-clerk-report-run-button"]').should(
      'be.visible',
    );

    checkA11y();
  });

  it('should be free of a11y issues on the Messages page type results', () => {
    loginAsCaseServicesSupervisor();

    cy.visit('/reports/docket-clerk-report');

    cy.get('[data-testid="docket-clerk-report-clerk-select"]')
      .find('option')
      .should('have.length.at.least', 2);
    cy.get('[data-testid="docket-clerk-report-clerk-select"]').then($select => {
      cy.wrap($select).select($select.find('option').eq(1).val() as string);
    });

    cy.get('[data-testid="docket-clerk-report-page-type-select"]').select(
      'messages',
    );

    cy.get('[data-testid="docket-clerk-report-run-button"]').click();

    cy.get('[data-testid="docket-clerk-report-messages-inbox-tab"]').should(
      'be.visible',
    );

    checkA11y();
  });
});
