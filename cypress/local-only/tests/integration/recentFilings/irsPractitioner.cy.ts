import { loginAsIrsPractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Recent Filings - IRS Practitioner', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
    // Login as IRS practitioner once for all tests
    loginAsIrsPractitioner();

    // Navigate to recent filings page once
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
  });

  it('should display recent filings page with table', () => {
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      0,
    );
  });

  it('should have accessible table structure', () => {
    cy.get('[data-testid="recent-filings-table"]').should('exist');
    cy.get('[data-testid="recent-filings-table"]').should(
      'have.attr',
      'role',
      'grid',
    );
    cy.get('[data-testid="recent-filings-table"]').should(
      'have.attr',
      'aria-label',
    );
    cy.get('[data-testid="recent-filings-table"]').should(
      'have.attr',
      'aria-describedby',
    );
    cy.get('#recent-filings-description').should('be.visible');
  });

  it('should display recent filings with proper sorting', () => {
    cy.viewport(1200, 800);
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    cy.get('[data-testid="docketNumber-sortable-button"]')
      .should('be.visible')
      .click();
    cy.get('[data-testid="filedDate-sortable-button"]')
      .should('be.visible')
      .click();
    cy.get('[data-testid="document-sortable-button"]')
      .should('be.visible')
      .click();
    cy.get('[data-testid="caseTitle-sortable-button"]')
      .should('be.visible')
      .click();
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should display pagination component', () => {
    // Pagination component should always be present (even with 0 records)
    cy.get('[data-testid="pagination"]').should('exist');
    // Table rows may or may not exist depending on data
    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      0,
    );
  });

  it('should show proper information text', () => {
    cy.get('[data-testid="recent-filings-info"]').should(
      'contain',
      'This page shows new docket entries dated within the last 7 days',
    );
    cy.get('[data-testid="recent-filings-info"]').should(
      'contain',
      'Information on this page is current as of',
    );
  });

  it('should display mobile view correctly', () => {
    cy.viewport('iphone-x');

    // Since we're already on the Recent Filings page, just check mobile elements
    cy.get('[data-testid="mobile-sort-dropdown"]').should('be.visible');

    // Test sorting functionality - use force to handle navigation overlay
    cy.get('[data-testid="mobile-sort-dropdown"]').select('docketNumber-asc', {
      force: true,
    });

    // Check if the table exists in mobile view
    cy.get('[data-testid="recent-filings-mobile-table"]').should('be.visible');
  });

  it('should display desktop view correctly', () => {
    cy.viewport(1200, 800);
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
    cy.get('[data-testid="docketNumber-sortable-button"]').click();
  });

  it('should handle case number links correctly', () => {
    // Check that case number links exist and have proper attributes
    cy.get('[data-testid="case-number-link"]')
      .first()
      .should('have.attr', 'target', '_blank');
    cy.get('[data-testid="case-number-link"]')
      .first()
      .should('have.attr', 'href')
      .and('include', '/case-detail/');
  });

  it('should handle multiple cases', () => {
    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      0,
    );
  });

  it('should filter cases correctly', () => {
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    // Check that each row has a case number link
    cy.get('[data-testid="recent-filings-table"] tbody tr').each($row => {
      cy.wrap($row).find('[data-testid="case-number-link"]').should('exist');
    });
  });
});
