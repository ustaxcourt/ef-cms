import { impactLevel } from '../../../../helpers/accessibility-impact';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Dashboard Page - Private Practitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.login('privatePractitioner');

    cy.injectAxe();

    cy.checkA11y(undefined, { includedImpacts: impactLevel }, terminalLog);
  });
});
