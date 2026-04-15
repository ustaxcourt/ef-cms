import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Read-Only Mode Integration', () => {
  it('should disable mutation buttons but still allow Advanced Search (GET) when read-only mode is active', () => {
    // Intercept the maintenance mode endpoint to return readOnlyMode: true
    cy.intercept('GET', '**/system/maintenance-mode', {
      statusCode: 200,
      body: {
        maintenanceMode: false,
        readOnlyMode: true,
      },
    }).as('getMaintenanceMode');

    loginAsPetitionsClerk();

    // Assert that the visual banner is present on the Dashboard
    cy.get('.read-only-banner').should('exist');
    cy.get('.read-only-banner').should('contain.text', 'System upgrade in progress');

    // Make sure the global search button in the header is NOT disabled
    cy.get('[data-testid="search-docket-number"]').should(
      'not.have.class',
      'usa-button-read-only-disabled'
    );

    // Navigate to a mutation-heavy page: Add Paper Filing
    cy.visit('/case-detail/103-20/add-paper-filing');
    
    // Ensure the Save and Serve button IS disabled
    cy.get('[data-testid="save-and-serve"]').should(
      'have.class',
      'usa-button-read-only-disabled'
    );

    // Navigate to the Advanced Search page
    cy.visit('/search');
    
    // Ensure the Advanced Search form submit button IS NOT disabled
    cy.get('[data-testid="docket-search-button"]').should(
      'not.have.class',
      'usa-button-read-only-disabled'
    );
  });
});
