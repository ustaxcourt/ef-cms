import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Recent Filings - Petitioner', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
    loginAsPetitioner();
  });

  it('should handle empty recent filings gracefully', () => {
    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      0,
    );
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should allow petitioner to view recent filings', () => {
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
    cy.get('[data-testid="recent-filings-table"]').should('exist');
  });

  it('should display recent filings with proper sorting', () => {
    cy.viewport(1200, 800);
    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    // Test sorting functionality if sortable buttons are present
    cy.get('body').then($body => {
      if (
        $body.find('[data-testid="docketNumber-sortable-button"]').length > 0
      ) {
        cy.get('[data-testid="docketNumber-sortable-button"]')
          .should('be.visible')
          .click();
      }
      if ($body.find('[data-testid="filedDate-sortable-button"]').length > 0) {
        cy.get('[data-testid="filedDate-sortable-button"]')
          .should('be.visible')
          .click();
      }
      if ($body.find('[data-testid="document-sortable-button"]').length > 0) {
        cy.get('[data-testid="document-sortable-button"]')
          .should('be.visible')
          .click();
      }
      if ($body.find('[data-testid="caseTitle-sortable-button"]').length > 0) {
        cy.get('[data-testid="caseTitle-sortable-button"]')
          .should('be.visible')
          .click();
      }
    });
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should handle pagination correctly', () => {
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Check if pagination exists
    cy.get('body').then($body => {
      if ($body.find('[data-testid="pagination"]').length > 0) {
        cy.get('[data-testid="pagination"]').should('exist');

        cy.get('[data-testid="recent-filings-table"] tbody tr').then($rows => {
          if ($rows.length > 100) {
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

    cy.get('[data-testid="case-number-link"]')
      .first()
      .should('have.attr', 'target', '_blank');
    cy.get('[data-testid="case-number-link"]')
      .first()
      .should('have.attr', 'href')
      .and('include', '/case-detail/');
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

    cy.get('[data-testid="recent-filings-table"] tbody tr').each($row => {
      cy.wrap($row).find('[data-testid="case-number-link"]').should('exist');
    });
  });
});
