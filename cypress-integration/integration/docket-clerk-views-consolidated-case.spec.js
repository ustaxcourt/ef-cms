describe('Docket clerk views consolidated case', function () {
  beforeEach(() => {
    cy.login('docketclerk');
  });

  it('should display lead case tag on the lead case in a consolidated group', () => {
    cy.visit('/case-detail/111-19');
    cy.get('#lead-case-tag').should('exist');
  });
});
