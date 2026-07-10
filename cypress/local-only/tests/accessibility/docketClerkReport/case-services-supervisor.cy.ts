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
});
