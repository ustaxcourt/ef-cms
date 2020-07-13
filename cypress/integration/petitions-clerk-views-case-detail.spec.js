describe('Petitions clerk views case detail', function () {
  before(() => {
    cy.login('petitionsclerk');
  });

  describe('case information tab', () => {
    it('should display a card for other petitioners in the petitioner tab', () => {
      cy.visit('/case-detail/101-20');

      cy.get('button#tab-case-information').click();

      cy.get('button#tab-petitioner').click();

      cy.get('div#other-petitioners-label').should('exist');
      cy.get('button#view-additional-petitioners-button')
        .scrollIntoView()
        .click();

      cy.get('div.other-petitioners-information').should('have.length', 7);
    });
  });
});
