describe('Docket clerk edits a court issued document', function () {
  before(() => {
    cy.login('docketclerk');
  });

  it('upload a court issued document, click on the in progress link, and navigate to the correct page', () => {
    cy.visit('case-detail/104-20/upload-court-issued');
    const freeText = `court document ${Math.random()}`;
    cy.get('#upload-description').type(freeText);
    cy.get('input#primary-document-file').attachFile(
      '../fixtures/w3-dummy.pdf',
    );
    cy.get('#save-uploaded-pdf-button').click();
    cy.get('#add-court-issued-docket-entry-button').click();
    cy.get('#document-type .select-react-element__input-container input')
      .clear()
      .type('Miscellaneous');
    cy.get('#react-select-2-option-0').click({ force: true });
    cy.get('#save-entry-button').click();
    cy.visit('document-qc/my/inProgress');
    cy.get('.case-link').contains(freeText).click();
    cy.get('h1').contains('Edit Docket Entry');
    cy.url().should('include', 'edit-court-issued');
  });
});
