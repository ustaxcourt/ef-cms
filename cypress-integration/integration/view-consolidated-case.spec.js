const {
  navigateTo: navigateToDashboard,
} = require('../support/pages/dashboard');

describe('View consolidated case', function () {
  describe('case information tab', () => {
    it('should display lead case tag when logged in as a docket clerk', () => {
      navigateToDashboard('docketclerk');
      cy.visit('/case-detail/111-19');
      cy.get('#lead-case-tag').should('exist');
    });

    it('should display lead case tag when logged in as a petitioner', () => {
      navigateToDashboard('petitioner');
      cy.visit('/case-detail/111-19');
      cy.get('#lead-case-tag').should('exist');
    });
  });
});
