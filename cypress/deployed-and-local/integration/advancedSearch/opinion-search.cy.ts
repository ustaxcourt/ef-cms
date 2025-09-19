import { loginAsDocketClerk1 } from '../../../helpers/authentication/login-as-helpers';
import {
  searchForDocuments,
  searchForOrderByJudge,
} from 'cypress/local-only/support/pages/public/advanced-search';
import {
  getColumnTextFields,
  sortFiledDateColumnAsc,
} from '../../../helpers/advancedSearch/column-sort-text-field';

describe('Docket clerk - Opinion Search', () => {
  it('should sort by descending filed date and reverse it correctly', () => {
    loginAsDocketClerk1();

    const judgeName = 'Foley';

    cy.get('[data-testid="search-link"]').click();
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
