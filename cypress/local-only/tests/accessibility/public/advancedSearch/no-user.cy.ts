import { impactLevel } from '../../../../../helpers/accessibility-impact';
import { terminalLog } from '../../../../../helpers/cypressTasks/logs';

describe('Advanced Search - Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Case tab', () => {
    it('should be free of a11y issues', () => {
      cy.visit('/');
      cy.get('#docket-number').type('103-20');
      cy.get('#docket-search-button').click();
      cy.get('.ustc-table').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
          },
        },
        terminalLog,
      );
    });
  });

  describe('Order tab', () => {
    it('should be free of a11y issues when searching with custom dates', () => {
      cy.visit('/');
      cy.get('[data-testid="order-search-tab"]').click();
      cy.get('#date-range').select('customDates');
      cy.get('#startDate-date-start').type('08/01/2001');
      cy.get('#advanced-search-button').click();
      cy.get('.search-results').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues when searching with no results', () => {
      cy.visit('/');
      cy.get('[data-testid="order-search-tab"]').click();
      cy.get('#keyword-search').type('meow');
      cy.get('#advanced-search-button').click();
      cy.get('#no-search-results').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
          },
        },
        terminalLog,
      );
    });
  });

  describe('Opinion tab', () => {
    it('should be free of a11y issues', () => {
      cy.visit('/');
      cy.get('[data-testid="opinion-search-tab"]').click();
      cy.get('#keyword-search').type('sunglasses');
      cy.get('#date-range').select('customDates');
      cy.get('#startDate-date-start').type('08/01/2001');
      cy.get('#advanced-search-button').click();
      cy.get('.search-results').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
          },
        },
        terminalLog,
      );
    });
  });
});
