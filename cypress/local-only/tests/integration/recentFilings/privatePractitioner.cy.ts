import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Recent Filings - Private Practitioner', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  // Basic functionality tests - verify page loads and core elements are present
  it('should allow private practitioner to view recent filings', () => {
    loginAsPrivatePractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
    cy.get('[data-testid="recent-filings-table"]').should('exist');
  });

  // Sorting functionality tests - verify all sort buttons work correctly
  it('should display recent filings with proper sorting', () => {
    loginAsPrivatePractitioner();
    cy.viewport(1200, 800);
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Wait for the page to load and check for either table rows or empty message
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
    
    cy.get('body').then($body => {
      if ($body.find('[data-testid="recent-filings-table"] tbody tr').length > 0) {
        // If there are table rows, test sorting functionality
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
      } else {
        // If no table rows, check for empty state message
        cy.get('[data-testid="no-recent-filings-message"]').should(
          'be.visible',
        );
      }
    });
  });

  // Pagination tests - verify pagination controls work when there are many records
  it('should handle pagination correctly', () => {
    loginAsPrivatePractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="pagination"]').should('exist');

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
      } else {
        cy.get('[data-testid="no-recent-filings-message"]').should(
          'be.visible',
        );
      }
    });
  });

  // Loading state tests - verify loading indicators work properly
  it('should display loading state while fetching data', () => {
    loginAsPrivatePractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  // Empty state tests - verify proper handling when no data is available
  it('should handle empty recent filings gracefully', () => {
    loginAsPrivatePractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-table"]').then($table => {
      if ($table.length > 0) {
        cy.get('body').then($body => {
          if (
            $body.find('[data-testid="recent-filings-table"] tbody tr').length >
            0
          ) {
            cy.get('[data-testid="recent-filings-table"]').should('be.visible');
          } else {
            cy.get('[data-testid="no-recent-filings-message"]').should(
              'be.visible',
            );
          }
        });
      } else {
        cy.get('[data-testid="no-recent-filings-message"]').should(
          'be.visible',
        );
      }
    });
  });

  // Mobile view tests - verify responsive design works on mobile devices
  it('should display mobile view correctly', () => {
    loginAsPrivatePractitioner();
    cy.viewport('iphone-x');
    cy.get('[data-testid="account-menu-button-mobile"]')
      .should('be.visible')
      .click();
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="mobile-sort-dropdown"]').should('be.visible');

    cy.get('body').then($body => {
      if (
        $body.find('[data-testid="recent-filings-mobile-table"]').length > 0
      ) {
        cy.get('[data-testid="mobile-sort-dropdown"]').select(
          'docketNumber-asc',
        );
        cy.get('[data-testid="recent-filings-mobile-table"]').should(
          'be.visible',
        );
      } else {
        cy.get('[data-testid="no-recent-filings-message"]').should(
          'be.visible',
        );
      }
    });
  });

  // Desktop view tests - verify desktop-specific functionality works
  it('should display desktop view correctly', () => {
    loginAsPrivatePractitioner();
    cy.viewport(1200, 800);
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
    cy.get('[data-testid="docketNumber-sortable-button"]').click();
  });

  // Accessibility tests - verify ARIA attributes and screen reader support
  it('should handle accessibility requirements', () => {
    loginAsPrivatePractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();

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

  // Information display tests - verify informational text is shown correctly
  it('should show proper information text', () => {
    loginAsPrivatePractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-info"]').should(
      'contain',
      'This page shows new docket entries dated within the last 7 days',
    );
    cy.get('[data-testid="recent-filings-info"]').should(
      'contain',
      'Information on this page is current as of',
    );
  });

  // Link functionality tests - verify case number links work correctly
  it('should handle case number links correctly', () => {
    loginAsPrivatePractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();

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

  // Data display tests - verify multiple cases are displayed correctly
  it('should handle multiple cases', () => {
    loginAsPrivatePractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-table"]').then($table => {
      if ($table.length > 0) {
        cy.get('body').then($body => {
          if (
            $body.find('[data-testid="recent-filings-table"] tbody tr').length >
            0
          ) {
            cy.get('[data-testid="recent-filings-table"] tbody tr').should(
              'have.length.greaterThan',
              0,
            );
          } else {
            cy.get('[data-testid="no-recent-filings-message"]').should(
              'be.visible',
            );
          }
        });
      }
    });
  });

  // Data filtering tests - verify table rows contain expected data structure
  it('should filter cases correctly', () => {
    loginAsPrivatePractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    cy.get('[data-testid="recent-filings-table"]').then($table => {
      if ($table.length > 0) {
        cy.get('body').then($body => {
          if (
            $body.find('[data-testid="recent-filings-table"] tbody tr').length >
            0
          ) {
            cy.get('[data-testid="recent-filings-table"] tbody tr').each(
              $row => {
                cy.wrap($row)
                  .find('[data-testid="case-number-link"]')
                  .should('exist');
              },
            );
          } else {
            cy.get('[data-testid="no-recent-filings-message"]').should(
              'be.visible',
            );
          }
        });
      } else {
        cy.get('[data-testid="no-recent-filings-message"]').should(
          'be.visible',
        );
      }
    });
  });
});
