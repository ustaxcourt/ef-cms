describe('Todays Orders - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/todays-orders');
    cy.get('.todays-orders').should('exist');

    cy.runA11y();
  });
});
