import { navigateToDashboard } from 'cypress/local-only/support/pages/maintenance';
import {
  searchForOrderByJudge,
  searchForDocuments,
} from 'cypress/local-only/support/pages/public/advanced-search';
import {
  getColumnTextFields,
  sortFiledDateColumnAsc,
} from '../../../../../helpers/advancedSearch/column-sort-text-field';

describe('Order Search', () => {
  it('should be able to search for an order by legacy judge', () => {
    const wantedLegacyJudge = 'Fieri';

    navigateToDashboard();
    cy.get('[data-testid="order-search-tab"]').click();
    searchForOrderByJudge(wantedLegacyJudge);
    searchForDocuments();

    cy.get('table.search-results');

    //assert that every judge in the search result list is the wanted legacy judge
    cy.get('tr.search-result').each(element => {
      cy.wrap(element).within(() => {
        cy.get('[data-testid="search-result-row-judge-name"]')

          .should('have.text', wantedLegacyJudge);
      });
    });
  });

  it('should sort by descending filed date and reverse it correctly', () => {
    const judgeName = 'Foley';

    navigateToDashboard();
    cy.get('[data-testid="order-search-tab"]').click();
    searchForOrderByJudge(judgeName);
    searchForDocuments();

    cy.get('table.search-results');
    getColumnTextFields('search-result-filed-date-column').then(
      columnTextFields => {
        const sortedColumnsTextFieldsDesc = [...columnTextFields]
          .sort(sortFiledDateColumnAsc)
          .reverse();
        expect(columnTextFields).to.deep.equal(sortedColumnsTextFieldsDesc);
      },
    );

    cy.get('[data-testid="sort-button-filed-date"]').click();
    getColumnTextFields('search-result-filed-date-column').then(
      columnTextFields => {
        const sortedColumnsTextFieldsDesc = [...columnTextFields].sort(
          sortFiledDateColumnAsc,
        );
        expect(columnTextFields).to.deep.equal(sortedColumnsTextFieldsDesc);
      },
    );
  });
});
