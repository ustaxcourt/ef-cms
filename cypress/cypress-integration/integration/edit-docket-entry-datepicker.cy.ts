describe('Edit Docket Entry- Change Doc Type', function () {
  it('should clear service date input when a new doc type is selected', () => {
    (cy as any).login('docketclerk');
    cy.visit('case-detail/104-19/docket-entry/3/edit-meta');
    cy.get(
      '#document-type .select-react-element__input-container input',
    ).clear();
    cy.get('#document-type .select-react-element__input-container input').type(
      'Certificate of Service',
    );

    cy.get('#react-select-2-option-0').click({ force: true });
    cy.get('input#date-of-service-date').clear();
    cy.get('input#date-of-service-date').type('01/01/2020');
    cy.get(
      '#document-type .select-react-element__input-container input',
    ).clear();
    cy.get('#document-type .select-react-element__input-container input').type(
      'Amended Certificate of Service',
    );
    cy.get('#react-select-2-option-0').click({ force: true });
    cy.get('input#date-of-service-date').should('be.empty');
  });
});
