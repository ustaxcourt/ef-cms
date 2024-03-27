describe('Login Page Accessibility', () => {
  before(() => {
    cy.visit('/login');
    cy.get('[data-testid="login-header"]');
    cy.contains('Log in to DAWSON');
    // cy.login('petitioner');
    // cy.get('footer').should('exist');
    cy.injectAxe();
  });

  it('should be free of a11y issues', () => {
    cy.checkA11y();
  });
});
