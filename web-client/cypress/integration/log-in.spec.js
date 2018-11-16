describe('Log in page', function() {
  before(() => {
    cy.visit('/log-in');
  });

  it('finds all the elements', () => {
    cy.get('form#log-in').should('exist');
    cy.get('form#log-in #name').should('exist');
    cy.get('form#log-in input[type="submit"]').should('exist');
  });

  it('fails login', () => {
    cy.get('form#log-in #name').type('Bad Actor');
    cy.get('form#log-in input[type="submit"]').click();
    cy.get('.usa-alert-error').should('contain', 'User not found');
    cy.url().should('include', 'log-in');
  });

  it('logs in successfully', () => {
    cy.get('form#log-in #name')
      .clear()
      .type('taxpayer');
    cy.get('form#log-in input[type="submit"]').click();
    cy.url().should('not.include', 'log-in');
    cy.get('header').should('contain', 'Hello, Test');
  });
});
