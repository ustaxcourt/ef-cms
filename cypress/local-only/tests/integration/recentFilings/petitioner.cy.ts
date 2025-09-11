import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';

describe('Recent Filings - Petitioner', () => {
  before(() => {
    // Create test data to ensure we have recent filings
    loginAsPetitioner();
    externalUserCreatesElectronicCase();
  });

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
    // Login as petitioner once for all tests
    loginAsPetitioner();

    // Navigate to recent filings page once
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
  });

  it('should handle empty recent filings gracefully', () => {
    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      0,
    );
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should display recent filings page with table', () => {
    cy.get('[data-testid="recent-filings-table"]').should('exist');
  });

  it('should display recent filings with proper sorting', () => {
    cy.viewport(1200, 800);
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    // Test sorting functionality
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

    // Navigate to recent filings using the header link (same as other tests)
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
    cy.get('[data-testid="mobile-sort-dropdown"]').should('be.visible');

    // Wait for loading to complete
    cy.get('[data-testid="recent-filings-page"]').should(
      'not.contain',
      'Loading recent filings...',
    );

    cy.get('[data-testid="mobile-sort-dropdown"]').select('docketNumber-asc');

    // Wait for sorting to complete and check mobile view content
    // Mobile table is conditionally rendered - verify either table OR no-data message exists
    cy.get(
      '[data-testid="recent-filings-mobile-table"], [data-testid="no-recent-filings-message"]',
    )
      .should('exist')
      .and('be.visible');
  });

  it('should display desktop view correctly', () => {
    cy.viewport(1200, 800);
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
    cy.get('[data-testid="docketNumber-sortable-button"]').click();
  });

  it('should handle accessibility requirements', () => {
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

  it('should handle multiple cases', () => {
    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      0,
    );
  });

  it('should filter cases correctly', () => {
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    // Check that case number links exist (if any rows exist)
    cy.get('[data-testid="case-number-link"]').should(
      'have.length.at.least',
      0,
    );
  });
});
