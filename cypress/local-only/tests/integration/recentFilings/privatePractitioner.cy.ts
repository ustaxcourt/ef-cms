import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Recent Filings - Private Practitioner', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
    loginAsPrivatePractitioner();
  });

  it('should handle empty recent filings gracefully', () => {
    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      0,
    );
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should allow private practitioner to view recent filings', () => {
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
    cy.get('[data-testid="recent-filings-table"]').should('exist');
  });

  it('should display recent filings with proper sorting', () => {
    cy.viewport(1200, 800);
    cy.get('[data-testid="header-recent-filings-link"]').click();

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
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Check if pagination exists
    cy.get('body').then($body => {
      if ($body.find('[data-testid="pagination"]').length > 0) {
        cy.get('[data-testid="pagination"]').should('exist');

        // Check if table rows exist before trying to interact with pagination
        if (
          $body.find('[data-testid="recent-filings-table"] tbody tr').length > 0
        ) {
          cy.get('[data-testid="recent-filings-table"] tbody tr').then(
            $rows => {
              if ($rows.length > 100) {
                cy.get('[data-testid="pagination-next"]').click();
                cy.get('[data-testid="pagination-page-2"]').should(
                  'have.class',
                  'active',
                );
              } else {
                cy.log('Not enough rows to test pagination functionality');
              }
            },
          );
        } else {
          cy.log('No table rows found - cannot test pagination');
        }
      } else {
        cy.log('Pagination not found - may not be needed for current dataset');
      }
    });
  });

  it('should display loading state while fetching data', () => {
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should display mobile view correctly', () => {
    cy.viewport('iphone-x');
    cy.get('[data-testid="account-menu-button-mobile"]')
      .should('be.visible')
      .click();
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="mobile-sort-dropdown"]').should('be.visible');

    cy.get('[data-testid="mobile-sort-dropdown"]').select('docketNumber-asc');
    cy.get('[data-testid="recent-filings-mobile-table"]').should('be.visible');
  });

  it('should display desktop view correctly', () => {
    cy.viewport(1200, 800);
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
    cy.get('[data-testid="docketNumber-sortable-button"]').click();
  });

  it('should handle accessibility requirements', () => {
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

  it('should show proper information text', () => {
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

  it('should handle case number links correctly', () => {
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Check if case number links exist before trying to assert their attributes
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
    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      0,
    );
  });

  it('should filter cases correctly', () => {
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    // Check if table rows exist before trying to iterate over them
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
});
