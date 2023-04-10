describe('Date picker should replace years with fewer than 4 characters with empty string', () => {
  before(() => {
    cy.login('docketclerk');
  });

  it('should', () => {
    cy.visit('case-detail/104-19');
    cy.get('#case-detail-menu-button').click();
    cy.get('#menu-button-add-deadline').click();
    cy.get('input#deadline-date-date').type('01/01/202');
    cy.get('textarea#description').type('Test 3-digit year');
    cy.get('#modal-button-confirm').click();
    cy.get("span[class='usa-error-message']").contains(
      'Enter a valid deadline date',
    );
  });
});
