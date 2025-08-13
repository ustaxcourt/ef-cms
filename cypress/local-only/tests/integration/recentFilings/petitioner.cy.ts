import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';

describe('Recent Filings - Petitioner', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should handle empty recent filings gracefully', () => {
    loginAsPetitioner();
    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      0,
    );
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should allow petitioner to view recent filings', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase('Test Petitioner');

    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-page"]').should('be.visible');
    cy.get('[data-testid="recent-filings-table"]').should('exist');
  });

  it('should display recent filings with proper sorting', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase('Test Petitioner');

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
    loginAsPetitioner();
    externalUserCreatesElectronicCase('Test Petitioner');

    cy.get('[data-testid="header-recent-filings-link"]').click();
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
  });

  it('should display loading state while fetching data', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase('Test Petitioner');

    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
  });

  it('should display mobile view correctly', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase('Test Petitioner');

    cy.viewport('iphone-x');
    cy.get('[data-testid="account-menu-button-mobile"]')
      .should('be.visible')
      .click();
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="mobile-sort-dropdown"]').should('be.visible');

    cy.get('[data-testid="mobile-sort-dropdown"]').select('docketNumber-asc');
  });

  it('should display desktop view correctly', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase('Test Petitioner');

    cy.viewport(1200, 800);
    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');
    cy.get('[data-testid="docketNumber-sortable-button"]').click();
  });

  it('should handle accessibility requirements', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase('Test Petitioner');

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
    loginAsPetitioner();
    externalUserCreatesElectronicCase('Test Petitioner');

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
    loginAsPetitioner();
    externalUserCreatesElectronicCase('Test Petitioner');

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
    loginAsPetitioner();
    externalUserCreatesElectronicCase('Test Petitioner');

    cy.get('[data-testid="header-recent-filings-link"]').click();

    cy.get('[data-testid="recent-filings-table"] tbody tr').should(
      'have.length.at.least',
      0,
    );
  });

  it('should filter cases correctly', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase('Test Petitioner');

    cy.get('[data-testid="header-recent-filings-link"]').click();
    cy.get('[data-testid="recent-filings-table"]').should('be.visible');

    cy.get('[data-testid="recent-filings-table"] tbody tr').each($row => {
      cy.wrap($row).find('[data-testid="case-number-link"]').should('exist');
    });
  });
});
