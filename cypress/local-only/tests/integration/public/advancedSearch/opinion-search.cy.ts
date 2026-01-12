import { navigateToDashboard } from 'cypress/local-only/support/pages/maintenance';
import {
  enterDocumentKeywordForAdvancedSearch,
  enterDocumentDocketNumber,
  searchForDocuments,
  unselectOpinionTypesExceptBench,
  searchForOrderByJudge,
} from 'cypress/local-only/support/pages/public/advanced-search';
import {
  getColumnTextFields,
  sortFiledDateColumnAsc,
} from '../../../../../helpers/advancedSearch/column-sort-text-field';

describe('Opinion Search', () => {
  it('should display results when a keyword and docketNumberWithSuffix is provided', () => {
    navigateToDashboard();
    cy.get('[data-testid="opinion-search-tab"]').click();
    enterDocumentKeywordForAdvancedSearch('opinion');
    enterDocumentDocketNumber('124-20L');
    searchForDocuments();
    cy.get('table.search-results');
  });

  it('should display results with a judge name', () => {
    navigateToDashboard();
    cy.get('[data-testid="opinion-search-tab"]').click();
    enterDocumentDocketNumber('107-19');

    unselectOpinionTypesExceptBench();
    searchForDocuments();

    cy.get('table.search-results');
    cy.contains('td', 'Foley');
  });

  it('should sort by descending filed date and reverse it correctly', () => {
    const judgeName = 'Foley';

    navigateToDashboard();
    cy.get('[data-testid="opinion-search-tab"]').click();
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
