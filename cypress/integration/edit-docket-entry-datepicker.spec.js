describe('Edit Docket Entry- Change Doc Type', function () {
  before(() => {
    cy.login('docketclerk');
  });
  it('should clear service date input when a new doc type is selected', () => {
    cy.visit('case-detail/104-19/docket-entry/3/edit-meta');
    cy.get('#document-type .select-react-element__input input')
      .clear()
      .type('Certificate of Service');

    cy.get('#react-select-2-option-0').click({ force: true });
    cy.get('input#date-of-service-date').clear().type('01/01/2020');
    cy.get('#document-type .select-react-element__input input')
      .clear()
      .type('Amended Certificate of Service');
    cy.get('#react-select-2-option-0').click({ force: true });
    cy.get('input#date-of-service-date').should('be.empty');
  });
});
