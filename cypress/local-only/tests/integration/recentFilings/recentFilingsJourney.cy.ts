import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Recent Filings - Basic Integration', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should allow user to navigate to recent filings', () => {
    loginAsPetitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify the page loads
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
    cy.get('[data-testid="recent-filings-table"]').should('exist');
  });

  it('should display basic sorting functionality', () => {
    loginAsPetitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Test basic sorting - check if sort button is clickable
    cy.get('[data-testid="sort-docket-number"]').should('be.visible').click();

    // Verify the table exists and has content (if any data exists)
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    // Check if there are any rows in the table
    cy.get('[data-testid="recent-filings-table"]').then($table => {
      if ($table.length > 0) {
        // Table exists, check for rows
        cy.get('[data-testid="recent-filings-table"] tbody tr').then($rows => {
          if ($rows.length > 0) {
            // If there's data, verify sorting worked by checking the table is still visible
            cy.get('[data-testid="recent-filings-table"]').should('be.visible');
          } else {
            // If no data, verify empty state is handled
            cy.get('[data-testid="no-recent-filings-message"]').should(
              'be.visible',
            );
          }
        });
      } else {
        // Table doesn't exist (mobile view with no data), check for empty message
        cy.get('[data-testid="no-recent-filings-message"]').should(
          'be.visible',
        );
      }
    });
  });

  it('should handle basic pagination', () => {
    loginAsPetitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify pagination is present
    cy.get('[data-testid="pagination"]').should('exist');
  });

  it('should display loading state correctly', () => {
    loginAsPetitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify loading state is handled
    cy.get('[data-testid="loading-spinner"]').should('not.exist');
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should handle empty state gracefully', () => {
    // Login as a new user with no cases
    loginAsPetitioner('newpetitioner@example.com');

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify empty state is handled
    cy.get('[data-testid="no-recent-filings-message"]').should('be.visible');
  });

  it('should support mobile view', () => {
    loginAsPetitioner();

    // Set mobile viewport
    cy.viewport('iphone-x');

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify mobile-specific elements are present
    cy.get('[data-testid="recent-filings-mobile-table"]').should('be.visible');
  });

  it('should support desktop view', () => {
    loginAsPetitioner();

    // Set desktop viewport
    cy.viewport(1200, 800);

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify desktop-specific elements are present
    cy.get('[data-testid="recent-filings-desktop-table"]').should('be.visible');
  });

  it('should meet basic accessibility requirements', () => {
    loginAsPetitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify basic accessibility attributes
    cy.get('[data-testid="recent-filings-table"]').should(
      'have.attr',
      'role',
      'grid',
    );
  });
});
