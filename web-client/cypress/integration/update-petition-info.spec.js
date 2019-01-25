describe('Updates the case information on a petition document', function() {
  before(() => {
    cy.login('petitionsclerk', '/case-detail/102-18');
  });

  it('clicks case info tab', () => {
    cy.get('#case-info-tab').click();
  });

  it('verifies the irs date is not defined', () => {
    cy.get('#irs-notice-date')
      .scrollIntoView()
      .should('contain', 'No Date Provided');
  });

  it('goes to the petition document info tab', () => {
    cy.login(
      'petitionsclerk',
      '/case-detail/102-18/documents/8eef49b4-9d40-4773-84ab-49e1e59e49cd',
    );
    cy.get('#date-of-notice-month')
      .scrollIntoView()
      .type('01');
    cy.get('#date-of-notice-day')
      .scrollIntoView()
      .type('06');
    cy.get('#date-of-notice-year')
      .scrollIntoView()
      .type('2001');
    cy.get('#case-edit-form').submit();
  });

  it('goes back to the case info tab on the case details page', () => {
    cy.login('petitionsclerk', '/case-detail/102-18');
    cy.get('#case-info-tab').click();
    cy.get('#irs-notice-date')
      .scrollIntoView()
      .should('contain', '01/06/2001');
  });
});
