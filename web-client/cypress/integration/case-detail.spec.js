describe('Dashboard', function() {
  describe('Petitioner view', () => {
    before(() => {
      cy.login('taxpayer');
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
