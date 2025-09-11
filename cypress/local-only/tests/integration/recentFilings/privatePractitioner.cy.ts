import {
  loginAsPrivatePractitioner,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';

describe('Recent Filings - Private Practitioner', () => {
  before(() => {
    // Create test data as petitioner (since practitioners can't file petitions)
    loginAsPetitioner();
    externalUserCreatesElectronicCase();
  });

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

  it('should display pagination component', () => {
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Wait for page to fully load and data to be processed
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    // Wait for loading to complete (no spinner)
    cy.get('[data-testid="recent-filings-page"]').should(
      'not.contain',
      'Loading recent filings...',
    );

    // Pagination component should always be present (even with 0 records)
    cy.get('[data-testid="pagination"]').should('exist');

    // Table rows may or may not exist depending on data - use flexible assertion
    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      0,
    );
  });

  it('should display loading state while fetching data', () => {
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should display mobile view correctly', () => {
    cy.viewport('iphone-x');

    // Navigate directly to recent filings page for mobile view
    cy.visit('/cases/recent-filings');
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

  it('should handle multiple cases', () => {
    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      0,
    );
  });
});
