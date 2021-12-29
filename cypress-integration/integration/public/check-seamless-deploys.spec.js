describe('Public user experiences seamless relaod after deployment', function () {
  // go to case search page and fill out appropriate fields
  // execute cypress command to modify deploy-date.txt
  // verify that the page reloads
  // verify form fields are saved after reload

  describe('random unroutable URL', () => {
    it('should display the not found error page when routing to a random URL that cannot be otherwise fulfilled by the router', () => {
      cy.visit('/this/definitely-does-not/exist');

      cy.get('div.big-blue-header h1').should('contain', 'Error 404');
      cy.get('a#home').should('exist');
      cy.get('a#home').click();
      cy.get('div.big-blue-header h1').should('not.contain', 'Error 404');
    });
  });
});
