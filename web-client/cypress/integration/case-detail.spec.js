describe('Dashboard', function() {
  describe('Petitioner view', () => {
    before(() => {
      cy.login('taxpayer');
      cy.get('.usa-button').click();

      cy.upload_file('w3-dummy.pdf', 'form#file-a-petition #petition-file');
      cy.upload_file(
        'w3-dummy.pdf',
        'form#file-a-petition #request-for-place-of-trial',
      );
      cy.upload_file(
        'w3-dummy.pdf',
        'form#file-a-petition #statement-of-taxpayer-id',
      );
      cy.get('form#file-a-petition button[type="submit"]').click();
      cy.get('.usa-alert-success', { timeout: 10000 }).should(
        'contain',
        'uploaded successfully',
      );
      cy.get('table a')
        .first()
        .click();
    });

    describe('case detail', () => {
      it('shows accordian header', () => {
        cy.get('.usa-accordion-button').should('exist');
      });
    });
  });
  describe('Petitions clerk view', () => {
    before(() => {
      cy.login('petitionsclerk');
      cy.get('table a')
        .first()
        .click();
    });
    it('shows save updates button', () => {
      cy.get('button#update-case').should('exist');
    });
  });
});
