describe('Edit Docket Entry - Change Doc Type', function () {
  it('should clear service date input when a new doc type is selected', () => {
    cy.login('docketclerk');
    cy.visit('case-detail/104-19/docket-entry/3/edit-meta'); // TODO 23803: Do not use seed data. Edit a paper filing.
    cy.get(
      '#document-type .select-react-element__input-container input',
    ).clear();
    cy.get('#document-type .select-react-element__input-container input').type(
      'Certificate of Service',
    );
    cy.get('#react-select-2-option-0').click({ force: true });
    cy.get('input#date-of-service-picker').clear();
    cy.get('input#date-of-service-picker').type('01/01/2020');
    cy.get(
      '#document-type .select-react-element__input-container input',
    ).clear();
    cy.get('#document-type .select-react-element__input-container input').type(
      'Amended Certificate of Service',
    );
    cy.get('#react-select-2-option-0').click({ force: true });
    cy.get('input#date-of-service-picker').should('be.empty');
  });
});
