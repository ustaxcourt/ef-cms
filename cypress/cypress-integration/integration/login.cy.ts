describe('Login Page Accessibility', () => {
  before(() => {
    cy.visit('/login');
    cy.get('[data-testid="login-header"]');
    cy.injectAxe();
  });

  it('should be free of a11y issues', () => {
    cy.checkA11y();
  });
});
