import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Custom Case Report - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();

    cy.visit('/reports/custom-case');
    cy.get('[data-testid="custom-case-report-table"]');
    cy.get('#caseCreationStartDate-date-start').type('04/19/1980'); // TODO - use data-testid
    cy.get('#caseCreationEndDate-date-end').type('04/19/2023'); // TODO - use data-testid
    cy.get('[data-testid="submit-custom-case-report-button"]').click();
    cy.get('[data-testid="custom-case-result-count"]');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: { listitem: { enabled: false } }, // TODO LINK
      },
      terminalLog,
    );
  });
});
