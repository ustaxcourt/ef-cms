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
      cy.get('#startDate-date-start').type('08/03/2001');
      cy.get('[data-testid="submit-order-advanced-search-button"]').click();
      cy.get('[data-testid="advanced-document-search-results-table"]');

      checkA11y();
    });
  });
  describe('Order search tab - standing order results', () => {
    // Standing orders (SPOS/SPTO/SSO) resolve `formattedJudgeName` from `judge`
    // rather than `signedJudgeName` in advancedDocumentSearchHelper. The result
    // set is stubbed so the scan does not depend on an indexed SSO document.
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.intercept('GET', '/case-documents/order-search*', {
        body: {
          results: [
            {
              caseCaption: 'Gamma Holdings, Petitioner',
              docketEntryId: 'ddd00004-0004-4000-8000-000000000004',
              docketNumber: '104-20',
              documentTitle: 'Standing Scheduling Order',
              documentType: 'Standing Scheduling Order',
              eventCode: 'SSO',
              filingDate: '2020-06-11T20:17:10.646Z',
              judge: 'Cohen',
              numberOfPages: 2,
            },
          ],
        },
      }).as('getOrderSearchResults');

      cy.visit('/search');
      cy.get('[data-testid="order-search-tab"]').click();
      cy.get('[data-testid="keyword-search-input"]').type('meow');
      cy.get('#startDate-date-start').type('08/03/2001');
      cy.get('[data-testid="submit-order-advanced-search-button"]').click();
      cy.wait('@getOrderSearchResults');
      cy.get('[data-testid="advanced-document-search-results-table"]');
      cy.contains('td', 'Cohen').should('exist');

      checkA11y();
    });
  });
  describe('Opinion search tab', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/search');
      cy.get('[data-testid="opinion-search-tab"]').click();
      cy.get('[data-testid="keyword-search-input"]').type('sunglasses');
      cy.get('#startDate-date-start').type('08/03/2001');
      cy.get('[data-testid="advanced-search-button"]').click();
      cy.get('[data-testid="advanced-document-search-results-table"]');

      checkA11y();
    });
  });
});
