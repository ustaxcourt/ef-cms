describe('Public Trial Sessions', () => {
  it('should display table information correctly', () => {
    cy.visit('/trial-sessions');
    cy.get('[data-testid="proceeding-type-filter"]').should('be.visible');
    cy.get('[data-testid="session-type-filter"]').should('be.visible');
    cy.get('[data-testid="location-filter"]').should('be.visible');
    cy.get('[data-testid="judge-filter"]').should('be.visible');

    cy.get('[data-testid="remote-proceedings-card"]').should('be.visible');
    cy.get('[data-testid="remote-proceedings-card"]')
      .find('a')
      .should('have.length', 2);

    cy.get('[data-testid="trial-sessions-reset-filters-button"]').should(
      'be.disabled',
    );
  });
});
