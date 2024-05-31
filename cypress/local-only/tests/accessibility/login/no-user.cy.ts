import { impactLevel } from '../../../../helpers/accessibility-impact';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Login - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/login');

    cy.get('[data-testid="email-input"]');

    cy.injectAxe();

    cy.checkA11y(undefined, { includedImpacts: impactLevel }, terminalLog);
  });
});