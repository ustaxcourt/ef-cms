import { impactLevel } from '../../../../helpers/accessibility-impact';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Dashboard Page - Reporters Office Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.login('reportersoffice');

    cy.injectAxe();
    cy.checkA11y(undefined, { includedImpacts: impactLevel }, terminalLog);
  });
});
