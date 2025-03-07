import { navigateToDashboard } from 'cypress/local-only/support/pages/maintenance';
import {
  searchForOrderByJudge,
  searchForDocuments,
} from 'cypress/local-only/support/pages/public/advanced-search';

describe('Order Search', () => {
  it('should be able to search for an order by legacy judge', () => {
    const judgeNameColumnIndex = 5;
    const wantedLegacyJudge = 'Fieri';

    navigateToDashboard();
    cy.get('[data-testid="order-search-tab"]').click();
    searchForOrderByJudge(wantedLegacyJudge);
    searchForDocuments();

    cy.get('table.search-results');

    //assert that every judge in the search result list is the wanted legacy judge
    cy.get('tr.search-result').each(element => {
      cy.wrap(element).within(() => {
        cy.get('td')
          .eq(judgeNameColumnIndex)
          .should('have.text', wantedLegacyJudge);
      });
    });
  });
});
