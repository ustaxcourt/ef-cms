import { checkA11y } from '../../../support/generalCommands/checkA11y';

describe('Login - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/login');

    cy.get('[data-testid="email-input"]');

    checkA11y();
  });
});
