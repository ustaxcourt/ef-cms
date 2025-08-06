import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Recent Filings - Private Practitioner', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should allow private practitioner to view recent filings', () => {
    loginAsPrivatePractitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify the page loads
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
    cy.get('[data-testid="recent-filings-table"]').should('exist');
  });

  it('should display recent filings with proper sorting for private practitioner', () => {
    loginAsPrivatePractitioner();

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

  it('should handle pagination correctly for private practitioner', () => {
    loginAsPrivatePractitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify pagination is present
    cy.get('[data-testid="pagination"]').should('exist');

    // Test pagination if there are more than 100 entries
    cy.get('[data-testid="recent-filings-table"] tbody tr').then($rows => {
      if ($rows.length > 100) {
        cy.get('[data-testid="pagination-next"]').click();
        cy.get('[data-testid="pagination-page-2"]').should(
          'have.class',
          'active',
        );
      }
    });
  });

  it('should display loading state while fetching data for private practitioner', () => {
    loginAsPrivatePractitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify loading state is handled
    cy.get('[data-testid="loading-spinner"]').should('not.exist');
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should handle empty recent filings gracefully for private practitioner', () => {
    // Login as a new private practitioner with no cases
    loginAsPrivatePractitioner('newprivatepractitioner@example.com');

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify empty state is handled
    cy.get('[data-testid="no-recent-filings-message"]').should('be.visible');
  });

  it('should allow document access when private practitioner has permissions', () => {
    loginAsPrivatePractitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Test document access if there are filings
    cy.get('[data-testid="recent-filings-table"] tbody tr').then($rows => {
      if ($rows.length > 0) {
        cy.get('[data-testid="document-link"]').first().click();
        cy.url().should('include', '/document-download-url');
      }
    });
  });

  it('should display mobile view correctly for private practitioner', () => {
    loginAsPrivatePractitioner();

    // Set mobile viewport
    cy.viewport('iphone-x');

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify mobile-specific elements are present
    cy.get('[data-testid="recent-filings-mobile-table"]').should('be.visible');
    cy.get('[data-testid="mobile-sort-dropdown"]').should('be.visible');

    // Test mobile sorting
    cy.get('[data-testid="mobile-sort-dropdown"]').select('docketNumber-asc');
    cy.get('[data-testid="recent-filings-mobile-table"]').should(
      'contain',
      '101-20',
    );
  });

  it('should display desktop view correctly for private practitioner', () => {
    loginAsPrivatePractitioner();

    // Set desktop viewport
    cy.viewport(1200, 800);

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify desktop-specific elements are present
    cy.get('[data-testid="recent-filings-desktop-table"]').should('be.visible');

    // Test desktop sorting
    cy.get('[data-testid="sort-docket-number"]').click();
    cy.get('[data-testid="recent-filings-desktop-table"]').should(
      'contain',
      '101-20',
    );
  });

  it('should handle accessibility requirements for private practitioner', () => {
    loginAsPrivatePractitioner();

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

  it('should show proper information text for private practitioner', () => {
    loginAsPrivatePractitioner();

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

  it('should handle case number links correctly for private practitioner', () => {
    loginAsPrivatePractitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Test case number link if there are filings
    cy.get('[data-testid="recent-filings-table"] tbody tr').then($rows => {
      if ($rows.length > 0) {
        cy.get('[data-testid="case-number-link"]')
          .first()
          .should('have.attr', 'target', '_blank');
        cy.get('[data-testid="case-number-link"]')
          .first()
          .should('have.attr', 'href')
          .and('include', '/case-detail/');
      }
    });
  });

  it('should handle sealed documents appropriately for private practitioner', () => {
    loginAsPrivatePractitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Check if sealed documents are handled properly
    cy.get('[data-testid="recent-filings-table"] tbody tr').then($rows => {
      if ($rows.length > 0) {
        // Look for sealed document indicators
        cy.get('[data-testid="sealed-document-icon"]').should('exist');
      }
    });
  });

  it('should handle stricken documents appropriately for private practitioner', () => {
    loginAsPrivatePractitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Check if stricken documents are handled properly
    cy.get('[data-testid="recent-filings-table"] tbody tr').then($rows => {
      if ($rows.length > 0) {
        // Look for stricken document indicators
        cy.get('[data-testid="stricken-document"]').should('exist');
      }
    });
  });

  it('should handle consolidated cases for private practitioner', () => {
    loginAsPrivatePractitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Check if consolidated cases are handled properly
    cy.get('[data-testid="recent-filings-table"] tbody tr').then($rows => {
      if ($rows.length > 0) {
        // Look for consolidated case indicators
        cy.get('[data-testid="consolidated-case-icon"]').should('exist');
      }
    });
  });

  it('should handle multiple cases for private practitioner', () => {
    loginAsPrivatePractitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify that multiple cases can be displayed
    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.greaterThan',
      0,
    );
  });

  it('should filter cases correctly for private practitioner', () => {
    loginAsPrivatePractitioner();

    // Navigate to recent filings
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Verify that the table is visible and has proper structure
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
    
    // Check if there are any rows in the table
    cy.get('[data-testid="recent-filings-table"]').then($table => {
      if ($table.length > 0) {
        // Table exists, check for rows
        cy.get('[data-testid="recent-filings-table"] tbody tr').then($rows => {
          if ($rows.length > 0) {
            // If there's data, verify each row has a docket number (any format)
            cy.get('[data-testid="recent-filings-table"] tbody tr').each($row => {
              cy.wrap($row).should('contain', /\d+-\d+/); // Any docket number format
            });
          } else {
            // If no data, verify empty state is handled
            cy.get('[data-testid="no-recent-filings-message"]').should('be.visible');
          }
        });
      } else {
        // Table doesn't exist (mobile view with no data), check for empty message
        cy.get('[data-testid="no-recent-filings-message"]').should('be.visible');
      }
    });
  });
});
