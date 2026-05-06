describe('Maintenance Mode Integration', () => {
  it('should redirect unauthenticated users to the maintenance page and not show a login button', () => {
    cy.intercept('GET', '**/system/maintenance-mode', {
      statusCode: 200,
      body: {
        maintenanceMode: true,
      },
    }).as('getMaintenanceMode');

    cy.visit('/');
    cy.url().should('include', '/maintenance');
    cy.get('[data-testid="maintenance-container"]').should('exist');
    cy.get('.maintenance-text').should(
      'contain.text',
      'DAWSON is currently down for maintenance',
    );
    cy.contains('button', 'Log In').should('not.exist');
    cy.contains('a', 'Log In').should('not.exist');
    cy.get('.login-container').should('not.exist');

    cy.visit('/login');
    cy.url().should('include', '/maintenance');
    cy.get('[data-testid="maintenance-container"]').should('exist');

    cy.visit('/search');
    cy.url().should('include', '/maintenance');
    cy.get('[data-testid="maintenance-container"]').should('exist');
  });
});
