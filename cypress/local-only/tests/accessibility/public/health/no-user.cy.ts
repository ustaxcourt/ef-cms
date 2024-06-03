import { impactLevel } from '../../../../../helpers/accessibility-impact';
import { terminalLog } from '../../../../../helpers/cypressTasks/logs';

describe('Health Check - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/health');
    cy.contains('Health Check');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
      },
      terminalLog,
    );
  });
});
