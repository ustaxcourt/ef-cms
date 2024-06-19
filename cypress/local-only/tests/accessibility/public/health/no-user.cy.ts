import { checkA11y } from '../../../../support/generalCommands/checkA11y';

describe('Health Check - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/health');
    cy.contains('Health Check');

    checkA11y();
  });
});
