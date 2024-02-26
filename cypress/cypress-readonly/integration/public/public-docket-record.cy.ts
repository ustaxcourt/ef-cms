describe('Public Docket Record', () => {
  it('should allow the user to generate and download a PDF of the docket record', () => {
    cy.visit('/');
    cy.get('input#docket-number').type('104-20');
    cy.get('button#docket-search-button').click();
    cy.get('[data-testid="header-public-case-detail"]').contains(
      'Docket Number: 104-20',
    );
    cy.get('[data-testid="print-public-docket-record-button"]').click();
    cy.get('[data-testid="modal-header"]');
  });
});
