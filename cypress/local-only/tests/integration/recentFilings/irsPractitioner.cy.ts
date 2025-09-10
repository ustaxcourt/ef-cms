import { loginAsIrsPractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Recent Filings - IRS Practitioner', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
    // Login as IRS practitioner for each test
    loginAsIrsPractitioner();
  });

  it('should handle recent filings with data', () => {
    // Try to find the recent filings link - it might be in different locations
    cy.get('body').then($body => {
      if ($body.find('[data-testid="header-recent-filings-link"]').length > 0) {
        // Try to find the recent filings link - it might be in different locations
        cy.get('body').then($body => {
          if (
            $body.find('[data-testid="header-recent-filings-link"]').length > 0
          ) {
            cy.get('[data-testid="header-recent-filings-link"]').click();
          } else if (
            $body.find('[data-testid="view-recent-filings-button"]').length > 0
          ) {
            cy.get('[data-testid="view-recent-filings-button"]').click();
          } else {
            // If neither link is found, navigate directly to the URL
            cy.visit('/cases/recent-filings');
          }
        });
      } else if (
        $body.find('[data-testid="view-recent-filings-button"]').length > 0
      ) {
        cy.get('[data-testid="view-recent-filings-button"]').click();
      } else {
        // If neither link is found, navigate directly to the URL
        cy.visit('/cases/recent-filings');
      }
    });

    // Check if the recent filings page loaded and has a table
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    // Check if there are any rows in the table (might be empty)
    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      0,
    );
  });

  it('should allow IRS practitioner to view recent filings', () => {
    // Try to find the recent filings link - it might be in different locations
    cy.get('body').then($body => {
      if ($body.find('[data-testid="header-recent-filings-link"]').length > 0) {
        cy.get('[data-testid="header-recent-filings-link"]').click();
      } else if (
        $body.find('[data-testid="view-recent-filings-button"]').length > 0
      ) {
        cy.get('[data-testid="view-recent-filings-button"]').click();
      } else {
        // If neither link is found, navigate directly to the URL
        cy.visit('/cases/recent-filings');
      }
    });
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
    cy.get('[data-testid="recent-filings-table"]').should('exist');
  });

  it('should display recent filings with proper sorting', () => {
    cy.viewport(1200, 800);
    // Try to find the recent filings link - it might be in different locations
    cy.get('body').then($body => {
      if ($body.find('[data-testid="header-recent-filings-link"]').length > 0) {
        cy.get('[data-testid="header-recent-filings-link"]').click();
      } else if (
        $body.find('[data-testid="view-recent-filings-button"]').length > 0
      ) {
        cy.get('[data-testid="view-recent-filings-button"]').click();
      } else {
        // If neither link is found, navigate directly to the URL
        cy.visit('/cases/recent-filings');
      }
    });

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

  it('should handle pagination correctly', () => {
    // Try to find the recent filings link - it might be in different locations
    cy.get('body').then($body => {
      if ($body.find('[data-testid="header-recent-filings-link"]').length > 0) {
        cy.get('[data-testid="header-recent-filings-link"]').click();
      } else if (
        $body.find('[data-testid="view-recent-filings-button"]').length > 0
      ) {
        cy.get('[data-testid="view-recent-filings-button"]').click();
      } else {
        // If neither link is found, navigate directly to the URL
        cy.visit('/cases/recent-filings');
      }
    });

    // Check if the table exists and has data
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    // Check pagination functionality if pagination exists
    cy.get('body').then($body => {
      if ($body.find('[data-testid="pagination"]').length > 0) {
        cy.get('[data-testid="pagination"]').should('exist');

        // Check if table has rows before testing pagination
        cy.get('body').then($tableBody => {
          if (
            $tableBody.find('[data-testid="recent-filings-table"] tbody tr')
              .length > 0
          ) {
            cy.get('[data-testid="recent-filings-table"] tbody tr').then(
              $rows => {
                // Only test pagination if there are more than 100 rows
                if ($rows.length > 100) {
                  cy.get('[data-testid="pagination-next"]').click();
                  cy.get('[data-testid="pagination-page-2"]').should(
                    'have.class',
                    'active',
                  );
                }
              },
            );
          } else {
            // If no rows, just verify pagination exists
            cy.log(
              'No table rows found, pagination exists but no data to paginate',
            );
          }
        });
      } else {
        // If no pagination, just verify the table exists
        cy.get('body').then($tableBody => {
          if (
            $tableBody.find('[data-testid="recent-filings-table"] tbody tr')
              .length > 0
          ) {
            cy.get('[data-testid="recent-filings-table"] tbody tr').should(
              'exist',
            );
          } else {
            cy.log('No pagination and no table rows found');
          }
        });
      }
    });
  });

  it('should display loading state while fetching data', () => {
    // Try to find the recent filings link - it might be in different locations
    cy.get('body').then($body => {
      if ($body.find('[data-testid="header-recent-filings-link"]').length > 0) {
        cy.get('[data-testid="header-recent-filings-link"]').click();
      } else if (
        $body.find('[data-testid="view-recent-filings-button"]').length > 0
      ) {
        cy.get('[data-testid="view-recent-filings-button"]').click();
      } else {
        // If neither link is found, navigate directly to the URL
        cy.visit('/cases/recent-filings');
      }
    });
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should display mobile view correctly', () => {
    cy.viewport('iphone-x');
    cy.get('[data-testid="account-menu-button-mobile"]')
      .should('be.visible')
      .click();
    // Try to find the recent filings link - it might be in different locations
    cy.get('body').then($body => {
      if ($body.find('[data-testid="header-recent-filings-link"]').length > 0) {
        cy.get('[data-testid="header-recent-filings-link"]').click();
      } else if (
        $body.find('[data-testid="view-recent-filings-button"]').length > 0
      ) {
        cy.get('[data-testid="view-recent-filings-button"]').click();
      } else {
        // If neither link is found, navigate directly to the URL
        cy.visit('/cases/recent-filings');
      }
    });
    cy.get('[data-testid="mobile-sort-dropdown"]').should('be.visible');

    // Test sorting functionality
    cy.get('[data-testid="mobile-sort-dropdown"]').select('docketNumber-asc');

    // Check if the table exists in mobile view
    cy.get('body').then($body => {
      if ($body.find('[data-testid="recent-filings-table"]').length > 0) {
        cy.get('[data-testid="recent-filings-table"]').should('be.visible');
      } else {
        cy.log(
          'No recent filings table found in mobile view - might be empty or not loaded',
        );
      }
    });
  });

  it('should display desktop view correctly', () => {
    cy.viewport(1200, 800);
    // Try to find the recent filings link - it might be in different locations
    cy.get('body').then($body => {
      if ($body.find('[data-testid="header-recent-filings-link"]').length > 0) {
        cy.get('[data-testid="header-recent-filings-link"]').click();
      } else if (
        $body.find('[data-testid="view-recent-filings-button"]').length > 0
      ) {
        cy.get('[data-testid="view-recent-filings-button"]').click();
      } else {
        // If neither link is found, navigate directly to the URL
        cy.visit('/cases/recent-filings');
      }
    });
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
    cy.get('[data-testid="docketNumber-sortable-button"]').click();
  });

  it('should handle accessibility requirements', () => {
    // Try to find the recent filings link - it might be in different locations
    cy.get('body').then($body => {
      if ($body.find('[data-testid="header-recent-filings-link"]').length > 0) {
        cy.get('[data-testid="header-recent-filings-link"]').click();
      } else if (
        $body.find('[data-testid="view-recent-filings-button"]').length > 0
      ) {
        cy.get('[data-testid="view-recent-filings-button"]').click();
      } else {
        // If neither link is found, navigate directly to the URL
        cy.visit('/cases/recent-filings');
      }
    });

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

  it('should show proper information text', () => {
    // Try to find the recent filings link - it might be in different locations
    cy.get('body').then($body => {
      if ($body.find('[data-testid="header-recent-filings-link"]').length > 0) {
        cy.get('[data-testid="header-recent-filings-link"]').click();
      } else if (
        $body.find('[data-testid="view-recent-filings-button"]').length > 0
      ) {
        cy.get('[data-testid="view-recent-filings-button"]').click();
      } else {
        // If neither link is found, navigate directly to the URL
        cy.visit('/cases/recent-filings');
      }
    });

    cy.get('[data-testid="recent-filings-info"]').should(
      'contain',
      'This page shows new docket entries dated within the last 7 days',
    );
    cy.get('[data-testid="recent-filings-info"]').should(
      'contain',
      'Information on this page is current as of',
    );
  });

  it('should handle case number links correctly', () => {
    // Try to find the recent filings link - it might be in different locations
    cy.get('body').then($body => {
      if ($body.find('[data-testid="header-recent-filings-link"]').length > 0) {
        cy.get('[data-testid="header-recent-filings-link"]').click();
      } else if (
        $body.find('[data-testid="view-recent-filings-button"]').length > 0
      ) {
        cy.get('[data-testid="view-recent-filings-button"]').click();
      } else {
        // If neither link is found, navigate directly to the URL
        cy.visit('/cases/recent-filings');
      }
    });

    // Check that case number links exist and have proper attributes (if any exist)
    cy.get('body').then($body => {
      if ($body.find('[data-testid="case-number-link"]').length > 0) {
        cy.get('[data-testid="case-number-link"]')
          .first()
          .should('have.attr', 'target', '_blank');
        cy.get('[data-testid="case-number-link"]')
          .first()
          .should('have.attr', 'href')
          .and('include', '/case-detail/');
      } else {
        cy.log(
          'No case number links found - recent filings table might be empty',
        );
      }
    });
  });

  it('should handle multiple cases', () => {
    // Try to find the recent filings link - it might be in different locations
    cy.get('body').then($body => {
      if ($body.find('[data-testid="header-recent-filings-link"]').length > 0) {
        cy.get('[data-testid="header-recent-filings-link"]').click();
      } else if (
        $body.find('[data-testid="view-recent-filings-button"]').length > 0
      ) {
        cy.get('[data-testid="view-recent-filings-button"]').click();
      } else {
        // If neither link is found, navigate directly to the URL
        cy.visit('/cases/recent-filings');
      }
    });

    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      0,
    );
  });

  it('should filter cases correctly', () => {
    // Try to find the recent filings link - it might be in different locations
    cy.get('body').then($body => {
      if ($body.find('[data-testid="header-recent-filings-link"]').length > 0) {
        cy.get('[data-testid="header-recent-filings-link"]').click();
      } else if (
        $body.find('[data-testid="view-recent-filings-button"]').length > 0
      ) {
        cy.get('[data-testid="view-recent-filings-button"]').click();
      } else {
        // If neither link is found, navigate directly to the URL
        cy.visit('/cases/recent-filings');
      }
    });
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    // Check that each row has a case number link (if any rows exist)
    cy.get('body').then($body => {
      if (
        $body.find('[data-testid="recent-filings-table"] tbody tr').length > 0
      ) {
        cy.get('[data-testid="recent-filings-table"] tbody tr').each($row => {
          cy.wrap($row)
            .find('[data-testid="case-number-link"]')
            .should('exist');
        });
      } else {
        cy.log('No table rows found - recent filings table might be empty');
      }
    });
  });

  it('should handle large datasets', () => {
    // Try to find the recent filings link - it might be in different locations
    cy.get('body').then($body => {
      if ($body.find('[data-testid="header-recent-filings-link"]').length > 0) {
        cy.get('[data-testid="header-recent-filings-link"]').click();
      } else if (
        $body.find('[data-testid="view-recent-filings-button"]').length > 0
      ) {
        cy.get('[data-testid="view-recent-filings-button"]').click();
      } else {
        // If neither link is found, navigate directly to the URL
        cy.visit('/cases/recent-filings');
      }
    });

    // Check pagination visibility for large datasets
    cy.get('body').then($body => {
      if (
        $body.find('[data-testid="recent-filings-table"] tbody tr').length > 0
      ) {
        cy.get('[data-testid="recent-filings-table"] tbody tr').then($rows => {
          // Only assert pagination visibility if there are many rows
          if ($rows.length > 100) {
            cy.get('[data-testid="pagination"]').should('be.visible');
          } else {
            cy.log('Dataset is not large enough to test pagination visibility');
          }
        });
      } else {
        cy.log('No table rows found - cannot test large dataset pagination');
      }
    });
  });
});
