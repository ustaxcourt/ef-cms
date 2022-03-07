describe('Health check', () => {
  const SMOKETESTS_LOCAL = Cypress.env('SMOKETESTS_LOCAL');

  if (!SMOKETESTS_LOCAL) {
    const TOTAL_SUCCESS_HEALTHCHECKS = 16; // 17 - 1 since we don't care about clamav

    it("should retrieve the status of the application's critical services", () => {
      cy.visit('/health');
      cy.url().should('include', '/health');
      cy.get('h1').should('contain', 'Health Check');
      cy.get('svg[data-icon="check-circle"]').should(
        'have.length',
        TOTAL_SUCCESS_HEALTHCHECKS,
      );
    });
  }
});
