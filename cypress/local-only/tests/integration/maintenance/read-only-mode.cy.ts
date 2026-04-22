import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Read-Only Mode Integration', () => {
  it('should allow form interactions and save operations before read-only mode is active', () => {
    loginAsPetitionsClerk();

    cy.intercept('GET', '**/system/maintenance-mode', {
      statusCode: 200,
      body: {
        maintenanceMode: false,
        readOnlyMode: false,
      },
    }).as('getMaintenanceMode');

    cy.visit('/case-detail/103-20/add-paper-filing');
    cy.get('.read-only-banner').should('not.exist');
    cy.get('[data-testid="save-and-serve"]').should('not.be.disabled');
    cy.get('.usa-button').contains('Cancel').should('not.be.disabled');
  });

  it('should show banner and disable save operations, but preserve form data and permit navigation, during read-only mode', () => {
    loginAsPetitionsClerk();

    cy.intercept('GET', '**/system/maintenance-mode', {
      statusCode: 200,
      body: {
        maintenanceMode: false,
        readOnlyMode: true,
      },
    }).as('getMaintenanceMode');

    cy.visit('/case-detail/103-20/add-paper-filing');
    cy.get('.read-only-banner').should('exist');
    cy.get('.read-only-banner').should(
      'contain.text',
      'We are performing maintenance.',
    );
    cy.get('[data-testid="save-and-serve"]').should('be.disabled');
    cy.get('[data-testid="docket-number-search-input"]').type('103-20');
    cy.get('[data-testid="docket-number-search-input"]').should(
      'have.value',
      '103-20',
    );
    cy.get('[data-testid="search-docket-number"]').should('not.be.disabled');
    cy.get('.usa-button').contains('Cancel').should('not.be.disabled');

    cy.visit('/search');
    cy.get('[data-testid="docket-search-button"]').should('not.be.disabled');
  });

  it('should hide banner and re-enable save operations after read-only mode is disengaged', () => {
    loginAsPetitionsClerk();

    cy.intercept('GET', '**/system/maintenance-mode', {
      statusCode: 200,
      body: {
        maintenanceMode: false,
        readOnlyMode: false,
      },
    }).as('getMaintenanceMode');

    cy.visit('/case-detail/103-20/add-paper-filing');
    cy.get('.read-only-banner').should('not.exist');
    cy.get('[data-testid="save-and-serve"]').should('not.be.disabled');
  });
});
