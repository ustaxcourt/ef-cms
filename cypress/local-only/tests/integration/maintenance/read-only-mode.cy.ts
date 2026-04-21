import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Read-Only Mode Integration', () => {
  it('should disable mutation buttons but still allow Advanced Search (GET) when read-only mode is active', () => {
    loginAsPetitionsClerk();

    cy.intercept('GET', '**/system/maintenance-mode', {
      statusCode: 200,
      body: {
        maintenanceMode: false,
        readOnlyMode: true,
      },
    }).as('getMaintenanceMode');

    cy.visit('/');

    cy.get('.read-only-banner').should('exist');
    cy.get('.read-only-banner').should(
      'contain.text',
      'We are performing maintenance.',
    );

    cy.get('[data-testid="search-docket-number"]').should('not.be.disabled');

    cy.visit('/case-detail/103-20/add-paper-filing');

    cy.get('[data-testid="save-and-serve"]').should('be.disabled');

    cy.visit('/search');

    cy.get('[data-testid="docket-search-button"]').should('not.be.disabled');
  });
});
