describe('Filing an Answer', function() {
  before(() => {
    cy.seed();
    cy.login('respondent', '/case-detail/102-19');
  });

  //TODO - fix these when we can actually upload a document again
  /*
  it('should have a file a document button', () => {
    cy.get('#button-file-document').click();
  });

  it('can select an answer type and document', () => {
    cy.get('#document-type').select('Answer');
    cy.upload_file('w3-dummy.pdf', '#file');
  });

  it('can upload the answer with indication of success', () => {
    cy.get('#file-a-document button[type="submit"]').click();
    cy.url().should('include', 'case-detail');
    cy.showsSuccessMessage(true);
  });

  it('docket record table reflects newly-added record', () => {
    cy.get(tableSelector)
      .find('tr')
      .should('have.length', rowCount + 1);
    cy.get(tableSelector)
      .find('a')
      .should('contain', 'Answer');
  });

  it('reflects changes to 102-19 by showing it in respondent work queue', () => {
    cy.get('#queue-nav').click();
    cy.get('table#workQueue')
      .find('a')
      .should('contain', '102-19');
  });
  */
});
