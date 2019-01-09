describe('Filing an Answer', function() {
  let rowCount;
  const tableSelector = 'table#docket-record';

  describe('File Document Form ', () => {
    before(() => {
      cy.login('respondent', '/case-detail/102-18');
      cy.get(tableSelector)
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

    it('can upload the answer with indication of success ', () => {
      cy.get('#file-a-document button[type="submit"]').click();
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

    it('reflects changes to 102-18 by showing it in respondent work queue', () => {
      cy.get('#queue-nav').click();
      cy.get('table#workQueue')
        .find('a')
        .should('contain', '102-18');
    });
  });
});
