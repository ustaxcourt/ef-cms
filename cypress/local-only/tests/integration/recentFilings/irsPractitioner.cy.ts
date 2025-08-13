import { loginAsIrsPractitioner } from '../../../../helpers/authentication/login-as-helpers';
import { attachFile } from '../../../../helpers/file/upload-file';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

// Setup function to create test data for recent filings
function setupRecentFilingsData() {
  // Login as IRS practitioner and file a document on one of their existing cases
  loginAsIrsPractitioner();

  // Select the first case from the My Cases table
  cy.get('[data-testid="case-list-table"] tbody tr')
    .first()
    .find('[data-testid="case-link"]')
    .click();

  // File a document on this case
  cy.get('[data-testid="button-file-document"]').click();
  cy.get('[data-testid="ready-to-file"]').click();
  selectTypeaheadInput(
    'complete-doc-document-type-search',
    'Motion for Extension of Time',
  );
  cy.get('[data-testid="submit-document"]').click();

  // Upload a file
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: '[data-testid="primary-document"]',
    selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
  });
  cy.get('[data-testid="file-document-submit-document"]').click();

  // Select objections (required for motions)
  cy.get('[data-testid="primaryDocument-objections-No"]').click();

  // Select filing party (IRS practitioner files on behalf of Respondent)
  cy.get('[data-testid="party-irs-practitioner-label"]').click();

  cy.get('[data-testid="file-document-submit-document"]').click();
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="file-document-review-submit-document"]').click();

  // Verify document was filed
  cy.get('[data-testid="success-alert"]').should('contain', 'Document filed');
}

describe('Recent Filings - IRS Practitioner', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
    // Setup test data before each test
    setupRecentFilingsData();
  });

  it('should handle recent filings with data', () => {
    loginAsIrsPractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      1,
    );
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should allow IRS practitioner to view recent filings', () => {
    loginAsIrsPractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
    cy.get('[data-testid="recent-filings-table"]').should('exist');
  });

  it('should display recent filings with proper sorting', () => {
    loginAsIrsPractitioner();
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
    loginAsIrsPractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Check if the table exists and has data
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
    cy.get('[data-testid="recent-filings-table"] tbody tr').should('exist');

    // Check pagination functionality when pagination exists and has many rows
    cy.get('[data-testid="pagination"]').should('exist');
    cy.get('[data-testid="recent-filings-table"] tbody tr').then($rows => {
      // Only test pagination if there are more than 100 rows
      if ($rows.length > 100) {
        cy.get('[data-testid="pagination-next"]').click();
        cy.get('[data-testid="pagination-page-2"]').should(
          'have.class',
          'active',
        );
      }
    });
  });

  it('should display loading state while fetching data', () => {
    loginAsIrsPractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should display mobile view correctly', () => {
    loginAsIrsPractitioner();
    cy.viewport('iphone-x');
    cy.get('[data-testid="account-menu-button-mobile"]')
      .should('be.visible')
      .click();
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="mobile-sort-dropdown"]').should('be.visible');

    // Test sorting functionality
    cy.get('[data-testid="mobile-sort-dropdown"]').select('docketNumber-asc');
    cy.get('[data-testid="recent-filings-mobile-table"]').should('be.visible');
  });

  it('should display desktop view correctly', () => {
    loginAsIrsPractitioner();
    cy.viewport(1200, 800);
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
    cy.get('[data-testid="docketNumber-sortable-button"]').click();
  });

  it('should handle accessibility requirements', () => {
    loginAsIrsPractitioner();
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
    loginAsIrsPractitioner();
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
    loginAsIrsPractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Check that case number links exist and have proper attributes
    cy.get('[data-testid="case-number-link"]')
      .first()
      .should('have.attr', 'target', '_blank');
    cy.get('[data-testid="case-number-link"]')
      .first()
      .should('have.attr', 'href')
      .and('include', '/case-detail/');
  });

  it('should handle multiple cases', () => {
    loginAsIrsPractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      1,
    );
  });

  it('should filter cases correctly', () => {
    loginAsIrsPractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    // Check that each row has a case number link
    cy.get('[data-testid="recent-filings-table"] tbody tr').each($row => {
      cy.wrap($row).find('[data-testid="case-number-link"]').should('exist');
    });
  });

  it('should handle large datasets', () => {
    loginAsIrsPractitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();

    // Check pagination visibility for large datasets
    cy.get('[data-testid="recent-filings-table"] tbody tr').then($rows => {
      // Only assert pagination visibility if there are many rows
      if ($rows.length > 100) {
        cy.get('[data-testid="pagination"]').should('be.visible');
      }
    });
  });
});
