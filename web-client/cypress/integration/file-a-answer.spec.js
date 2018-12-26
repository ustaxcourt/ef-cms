describe('Filing an Answer', function() {
  let rowCount;
  before(() => {
    cy.login('respondent');
  });

  describe('Respondent dashboard ', () => {
    it('case list is visible with link to 102-18', () => {
      cy.contains('table a', '102-18');
    });
  });

  describe('File Document Form ', () => {
    before(() => {
      cy.routeTo('/case-detail/102-18');
      cy.get('table')
        .find('tr')
        .then($trs => {
          rowCount = $trs.length;
        });
    });

    it('should have a file a document button', () => {
      cy.get('#button-file-document').click();
    });

    it('can select an answer type and document', () => {
      cy.get('#document-type').select('Answer');
      cy.upload_file('w3-dummy.pdf', '#file');
    });

    it('can upload the answer with indication of success', () => {
      cy.get('#file-a-document button[type="submit"]').click();
      cy.showsSuccessMessage(true);
    });

    it('docket record table reflects newly-added record', () => {
      cy.get('table')
        .find('tr')
        .should('have.length', rowCount + 1);
      cy.get('table')
        .find('a')
        .should('contain', 'Answer');
    });
  });
});
