describe('Maintenance Mode Integration', () => {
  it('should redirect unauthenticated users to the maintenance page and not show a login button', () => {
    // Intercept the maintenance mode endpoint to return maintenanceMode: true
    cy.intercept('GET', '**/system/maintenance-mode', {
      statusCode: 200,
      body: {
        maintenanceMode: true,
      },
    }).as('getMaintenanceMode');

    // Attempt to navigate to the dashboard (would normally redirect to /login)
    cy.visit('/');

    // Assert that we are redirected to /maintenance
    cy.url().should('include', '/maintenance');

    // Assert that the maintenance container is present
    cy.get('[data-testid="maintenance-container"]').should('exist');
    cy.get('.maintenance-text').should('contain.text', 'DAWSON is currently down for maintenance');

    // Assert that there is NO login button visible (it's not rendered on the maintenance view)
    cy.contains('button', 'Log In').should('not.exist');
    cy.contains('a', 'Log In').should('not.exist');
    cy.get('.login-container').should('not.exist');

    // Attempt to navigate directly to the login page
    cy.visit('/login');

    // Assert that we are STILL redirected to /maintenance
    cy.url().should('include', '/maintenance');
    cy.get('[data-testid="maintenance-container"]').should('exist');

    // Attempt to navigate directly to the search page
    cy.visit('/search');

    // Assert that we are redirected to /maintenance here as well
    cy.url().should('include', '/maintenance');
    cy.get('[data-testid="maintenance-container"]').should('exist');
  });
});
