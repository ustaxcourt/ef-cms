describe('File an Answer', function() {
  let rowCount;
  before(() => {
    cy.login('respondent');
  });

  describe('Respondent dashboard view (should contain 1 item of 102-18)', () => {
    it('finds footer element', () => {
      cy.get('footer').should('exist');
    });

    it('case list is visible', () => {
      cy.get('table')
        .find('tr')
        .then($trs => {
          rowCount = $trs.length;
        });
      cy.get('#search-field').type('102-18');
      cy.get('#search-input button').click();
    });
  });

  describe('file a document', () => {
    before(() => {
      cy.url().should('include', 'case-detail/102-18');
    });

    it('should have a file a document button', () => {
      cy.get('#button-file-document').click();
    });

    it('select an answer type document', () => {
      cy.get('#document-type').select('Answer');

      cy.upload_file('w3-dummy.pdf', '#file');
    });

    it('upload the answer', () => {
      cy.get('#file-a-document button[type="submit"]').click();
    });

    it('go back to dashboard', () => {
      cy.get('#queue-nav').click();
    });

    it('case list table reflects newly-added record', () => {
      cy.get('table')
        .find('tr')
        .should('have.length', rowCount + 1);
    });
  });
});
