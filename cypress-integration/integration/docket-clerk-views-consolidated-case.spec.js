describe('Docket clerk views consolidated case', function () {
  beforeEach(() => {
    cy.login('docketclerk');
  });

  describe('case information tab', () => {
    it('should display other petitioners in main party information box', () => {
      cy.visit('/case-detail/111-19');
      cy.get('#lead-case-tag').should('exist');
    });
  });
});
