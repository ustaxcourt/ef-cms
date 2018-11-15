describe('Petitions clerk view', () => {
  before(() => {
    cy.login('petitionsclerk');
  });
  describe('dashboard', () => {
    it("doesn't find case button", () => {
      cy.get('main')
        .find('.usa-button')
        .should('not.exist');
    });
    it('finds work queue table', () => {
      cy.get('main')
        .find('#workQueue')
        .should('exist');
    });
  });
  describe('petition validation', () => {
    it('opens case detail', () => {
      cy.get('main')
        .find('#workQueue a')
        .first()
        .click();
      cy.url().should('include', 'case-detail');
    });
    it('controls for validating petition', () => {
      cy.get('#update-case').should('exist');
      cy.get('table .fa-file-pdf').should('exist');
      cy.get('table input[type="checkbox"]').should('exist');
    });
    it('validates a document and removes it from queue', () => {
      cy.get('table label').click({ multiple: true });
    });
  });
});
