describe('Login - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/login');

    cy.get('[data-testid="email-input"]');

    cy.runA11y();
  });
});
