describe('Health Check - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/health');
    cy.contains('Health Check');

    cy.runA11y();
  });
});
