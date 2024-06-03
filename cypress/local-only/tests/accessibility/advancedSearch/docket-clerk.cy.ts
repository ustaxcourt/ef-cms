import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Advanced Search - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Order search tab', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/search');
      cy.get('[data-testid="order-search-tab"]').click();
      cy.get('[data-testid="keyword-search-input"]').type('meow');
      cy.get('#date-range').select('customDates');
      cy.get('#startDate-date-start').type('08/03/2001');
      cy.get('[data-testid="submit-order-advanced-search-button"]').click();

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: { 'nested-interactive': { enabled: false } },
        },
        terminalLog,
      );
    });
  });

  describe('Opinion search tab', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/search');
      cy.get('[data-testid="opinion-search-tab"]').click();
      cy.get('[data-testid="keyword-search-input"]').type('sunglasses');
      cy.get('#date-range').select('customDates');
      cy.get('#startDate-date-start').type('08/03/2001');
      cy.get('[data-testid="advanced-search-button"]').click();

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: { 'nested-interactive': { enabled: false } },
        },
        terminalLog,
      );
    });
  });
});
