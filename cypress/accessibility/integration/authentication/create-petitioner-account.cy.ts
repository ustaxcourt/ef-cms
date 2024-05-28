import { terminalLog } from '../../../helpers/cypressTasks/logs';

describe('Login Page Accessibility', () => {
  it('should be free of a11y issues', () => {
    cy.visit('/create-account/petitioner');

    cy.get('[data-testid="email-input"]');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      { includedImpacts: ['serious', 'critical'] }, // minor/moderate/serious/critical
      terminalLog,
    );
  });
});
