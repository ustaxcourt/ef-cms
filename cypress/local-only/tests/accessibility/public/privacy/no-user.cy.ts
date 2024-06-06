describe('Privacy - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/privacy');
    cy.contains('Privacy').should('exist');

    cy.runA11y();
  });
});
