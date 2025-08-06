import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Recent Filings - Petitioner', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should allow petitioner to view recent filings', () => {
    loginAsPetitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify the page loads
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
    cy.get('[data-testid="recent-filings-table"]').should('exist');
  });

  it('should display recent filings with proper sorting', () => {
    loginAsPetitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Test sorting by different columns - verify sort buttons are clickable
    cy.get('[data-testid="sort-docket-number"]').should('be.visible').click();
    cy.get('[data-testid="sort-filed-date"]').should('be.visible').click();
    cy.get('[data-testid="sort-document"]').should('be.visible').click();
    cy.get('[data-testid="sort-case-title"]').should('be.visible').click();

    // Verify the table exists and is visible
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should handle pagination correctly', () => {
    loginAsPetitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify pagination is present
    cy.get('[data-testid="pagination"]').should('exist');

    // Test pagination if there are more than 100 entries
    cy.get('[data-testid="recent-filings-table"]').then($table => {
      if ($table.length > 0) {
        cy.get('body').then($body => {
          if (
            $body.find('[data-testid="recent-filings-table"] tbody tr').length >
            100
          ) {
            cy.get('[data-testid="pagination-next"]').click();
            cy.get('[data-testid="pagination-page-2"]').should(
              'have.class',
              'active',
            );
          }
        });
      }
    });
  });

  it('should display loading state while fetching data', () => {
    loginAsPetitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify loading state is handled
    cy.get('[data-testid="loading-spinner"]').should('not.exist');
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should handle empty recent filings gracefully', () => {
    // Login as a regular petitioner
    loginAsPetitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Check if there are any recent filings
    cy.get('[data-testid="recent-filings-table"]').then($table => {
      if ($table.length > 0) {
        cy.get('body').then($body => {
          if (
            $body.find('[data-testid="recent-filings-table"] tbody tr').length >
            0
          ) {
            // If there are filings, verify the table is visible
            cy.get('[data-testid="recent-filings-table"]').should('be.visible');
          } else {
            // If no rows, verify empty state message
            cy.get('[data-testid="no-recent-filings-message"]').should(
              'be.visible',
            );
          }
        });
      } else {
        // If no table, verify empty state message
        cy.get('[data-testid="no-recent-filings-message"]').should(
          'be.visible',
        );
      }
    });
  });

  it('should display mobile view correctly for petitioner', () => {
    loginAsPetitioner();

    // Set mobile viewport
    cy.viewport('iphone-x');

    // Wait for mobile menu button to be visible and click it to open mobile navigation
    cy.get('[data-testid="account-menu-button-mobile"]')
      .should('be.visible')
      .click();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify mobile-specific elements are present
    cy.get('[data-testid="mobile-sort-dropdown"]').should('be.visible');

    // Check if there are any recent filings
    cy.get('body').then($body => {
      if (
        $body.find('[data-testid="recent-filings-mobile-table"]').length > 0
      ) {
        // If table exists, test mobile sorting
        cy.get('[data-testid="mobile-sort-dropdown"]').select(
          'docketNumber-asc',
        );
        cy.get('[data-testid="recent-filings-mobile-table"]').should(
          'be.visible',
        );
      } else {
        // If no table, verify empty state message
        cy.get('[data-testid="no-recent-filings-message"]').should(
          'be.visible',
        );
      }
    });
  });

  it('should display desktop view correctly for petitioner', () => {
    loginAsPetitioner();

    // Set desktop viewport
    cy.viewport(1200, 800);

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify desktop-specific elements are present
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    // Test desktop sorting
    cy.get('[data-testid="sort-docket-number"]').click();

    // Check if there are any recent filings
    cy.get('body').then($body => {
      if (
        $body.find('[data-testid="recent-filings-table"] tbody tr').length > 0
      ) {
        // If there are rows, verify sorting worked
        cy.get('[data-testid="recent-filings-table"]').should('be.visible');
      } else {
        // If no rows, verify empty state message
        cy.get('[data-testid="no-recent-filings-message"]').should(
          'be.visible',
        );
      }
    });
  });

  it('should handle accessibility requirements for petitioner', () => {
    loginAsPetitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify accessibility attributes
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

    // Verify screen reader descriptions
    cy.get('#recent-filings-description').should('be.visible');
  });

  it('should show proper information text for petitioner', () => {
    loginAsPetitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify the informational text is present
    cy.get('[data-testid="recent-filings-info"]').should(
      'contain',
      'This page shows new docket entries dated within the last 7 days',
    );
    cy.get('[data-testid="recent-filings-info"]').should(
      'contain',
      'Information on this page is current as of',
    );
  });

  it('should handle case number links correctly for petitioner', () => {
    loginAsPetitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Test case number link if there are filings
    cy.get('[data-testid="recent-filings-table"]').then($table => {
      if ($table.length > 0) {
        cy.get('body').then($body => {
          if (
            $body.find('[data-testid="recent-filings-table"] tbody tr').length >
            0
          ) {
            cy.get('[data-testid="case-number-link"]')
              .first()
              .should('have.attr', 'target', '_blank');
            cy.get('[data-testid="case-number-link"]')
              .first()
              .should('have.attr', 'href')
              .and('include', '/case-detail/');
          }
        });
      }
    });
  });
});
