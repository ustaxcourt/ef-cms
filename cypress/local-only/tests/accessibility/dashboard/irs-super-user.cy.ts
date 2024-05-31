import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsIrsSuperUser } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Dashboard Page - IRS Super User Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsIrsSuperUser();

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: {
          'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
        },
      },
      terminalLog,
    );
  });

  // TODO: Move elsewhere?
  describe('Search', () => {
    it('should be free of a11y issues when performing docket search', () => {
      loginAsIrsSuperUser();
      cy.get('#docket-search-field').type('103-19');
      cy.get('.usa-search-submit-text').click();
      cy.get('#case-title').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });

  // TODO: Move elsewhere?
  describe('Advanced search', () => {
    it('should be free of a11y issues while performing search by petitioner name and viewing results', () => {
      loginAsIrsSuperUser();
      cy.get('#advanced-search-button').click();
      cy.get('#petitioner-name').type('cairo');
      cy.get('#advanced-search-button').click();
      cy.get('.search-results').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues while performing search by docket number and viewing case details', () => {
      loginAsIrsSuperUser();
      cy.get('#advanced-search-button').click();
      cy.get('#docket-number').type('103-19');
      cy.get('#docket-search-button').click();
      cy.get('#case-title').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });
});
