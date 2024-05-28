import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Forgot Password - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/forgot-password');

    cy.get('[data-testid="email-input"]');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      { includedImpacts: ['serious', 'critical'] }, // minor/moderate/serious/critical
      terminalLog,
    );
  });
});
