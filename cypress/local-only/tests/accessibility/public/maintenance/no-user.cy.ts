describe('Maintenance - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/maintenance');
    cy.get('[data-testid="maintenance-container"]').should('exist');

    cy.runA11y();
  });
});
