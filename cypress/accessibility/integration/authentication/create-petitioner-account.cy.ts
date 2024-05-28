import { terminalLog } from '../../../helpers/cypressTasks/logs';

describe('Login Page Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/create-account/petitioner');

    cy.get('[data-testid="create-petitioner-account-container"]');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      { includedImpacts: ['serious', 'critical'] }, // minor/moderate/serious/critical
      terminalLog,
    );
  });
});
