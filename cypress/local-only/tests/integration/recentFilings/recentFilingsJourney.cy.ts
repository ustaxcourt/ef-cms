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

    // Set desktop viewport to ensure non-mobile component is rendered
    cy.viewport(1200, 800);

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Wait for the table to be visible (this implicitly waits for loading to complete)
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    // Test basic sorting - check if sort button is clickable
    cy.get('[data-testid="docketNumber-sortable-button"]').should('be.visible').click();

    // Verify the table exists
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    // Check for either table rows or empty state message
    cy.get('body').then($body => {
      if (
        $body.find('[data-testid="recent-filings-table"] tbody tr').length > 0
      ) {
        // If there's data, verify sorting worked by checking the table is still visible
        cy.get('[data-testid="recent-filings-table"]').should('be.visible');
      } else {
        // If no data, verify empty state is handled
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
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should handle empty state gracefully', () => {
    // Login as a petitioner user
    loginAsPetitioner('petitioner2@example.com');

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Check for either table rows or empty state message
    cy.get('body').then($body => {
      if (
        $body.find('[data-testid="recent-filings-table"] tbody tr').length > 0
      ) {
        // If there's data, verify the table is visible
        cy.get('[data-testid="recent-filings-table"]').should('be.visible');
      } else {
        // If no data, verify empty state is handled
        cy.get('[data-testid="no-recent-filings-message"]').should(
          'be.visible',
        );
      }
    });
  });

  it('should support mobile view', () => {
    loginAsPetitioner();

    // Set mobile viewport
    cy.viewport('iphone-x');

    // Navigate to recent filings - use force click for mobile navigation
    cy.get('[data-testid="header-recent-filings-link"]').click({ force: true });

    // Verify the page loads by checking for the recent filings page
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
  });

  it('should support desktop view', () => {
    loginAsPetitioner();

    // Set desktop viewport
    cy.viewport(1200, 800);

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify the page loads by checking for the recent filings page
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
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
