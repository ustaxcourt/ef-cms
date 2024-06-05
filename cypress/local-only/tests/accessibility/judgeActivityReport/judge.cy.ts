import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Judge Activity Report - Judge Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsColvin();
    cy.visit('/reports/judge-activity-report');
    cy.get('[data-testid="view-statistics-button"]').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: {
          'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
          'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
        },
      },
      terminalLog,
    );
  });
});
