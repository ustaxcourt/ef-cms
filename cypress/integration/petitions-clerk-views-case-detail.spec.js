describe('Petitions clerk views case detail', function () {
  beforeEach(() => {
    cy.login('petitionsclerk');
  });

  describe('case information tab', () => {
    it('should display other petitioners in main party information box', () => {
      cy.visit('/case-detail/101-20');

      cy.get('button#tab-case-information').click();

      cy.get('button#tab-parties').click();

      cy.get('.petitioner-card').should('have.length', 8);
    });
  });

  describe('draft documents tab', () => {
    it('should display draft documents', () => {
      cy.visit('/case-detail/103-20');

      cy.get('button#tab-drafts').click();

      cy.get('.attachment-viewer-button').should('contain', 'First draft');
      cy.get('.attachment-viewer-button').first().click();

      cy.get('.document-viewer--documents h3').should('contain', 'First draft');

      cy.get('.message-document-actions').children().should('have.length', 5);
    });
  });
});
