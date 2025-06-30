import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

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
      cy.get('[data-testid="advanced-document-search-results-table"]');

      checkA11y();
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
      cy.get('[data-testid="advanced-document-search-results-table"]');

      checkA11y();
    });
  });
});
