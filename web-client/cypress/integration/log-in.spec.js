describe('Log in page', function() {
  before(() => {
    cy.visit('/log-in');
  });

  it('finds all the elements', () => {
    cy.get('form#log-in').should('exist');
    cy.get('form#log-in #name').should('exist');
    cy.get('form#log-in input[type="submit"]').should('exist');
  });
});
