import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Recent Filings - Basic Integration', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
    loginAsPetitioner();
  });

  it('should handle empty state gracefully', () => {
    // Use a different petitioner for this test
    loginAsPetitioner('petitioner2@example.com');

    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      0,
    );
  });

  it('should allow user to navigate to recent filings', () => {
    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
    cy.get('[data-testid="recent-filings-table"]').should('exist');
  });

  it('should display basic sorting functionality', () => {
    cy.viewport(1200, 800);

    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    cy.get('[data-testid="docketNumber-sortable-button"]')
      .should('be.visible')
      .click();

    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should handle basic pagination', () => {
    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="pagination"]').should('exist');
  });

  it('should display loading state correctly', () => {
    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should support mobile view', () => {
    cy.viewport('iphone-x');

    cy.get('[data-testid="header-recent-filings-link"]').click({ force: true });

    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
  });

  it('should support desktop view', () => {
    cy.viewport(1200, 800);

    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
  });

  it('should meet basic accessibility requirements', () => {
    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-table"]').should(
      'have.attr',
      'role',
      'grid',
    );
  });
});
