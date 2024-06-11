describe('Contact Us - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/contact');
    cy.contains('Contact Us').should('exist');

    cy.runA11y();
  });
});
