import { checkA11y } from '../../../../support/generalCommands/checkA11y';

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

      checkA11y();
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

      checkA11y();
    });

    it('should be free of a11y issues when searching with no results', () => {
      cy.visit('/');
      cy.get('[data-testid="order-search-tab"]').click();
      cy.get('#keyword-search').type('meow');
      cy.get('#advanced-search-button').click();
      cy.get('#no-search-results').should('exist');

      checkA11y();
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

      checkA11y();
    });
  });
});
