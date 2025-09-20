import {
  addOrderToDocketEntry,
  createOrder,
} from '../../../helpers/caseDetail/docketRecord/courtIssuedFiling/create-order-and-decision';
import { externalUserCreatesElectronicCase } from '../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../helpers/documentQC/petitionsclerk-serves-petition';
import { retry } from '../../../helpers/retry';
import { v4 } from 'uuid';
import {
  searchForDocuments,
  searchForOrderByJudge,
} from 'cypress/local-only/support/pages/public/advanced-search';
import {
  getColumnTextFields,
  sortFiledDateColumnAsc,
} from '../../../helpers/advancedSearch/column-sort-text-field';

describe('Docket clerk', () => {
  it('should should be able to search for orders using the document contents', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsDocketClerk1();
      goToCase(docketNumber);

      // Create an order with very specific text inside of it
      const uniqueString = v4();
      createOrder({ contents: uniqueString });
      addOrderToDocketEntry();

      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="order-search-tab"]').click();
      cy.get('#docket-number').type(docketNumber); // Not sure if we only want to look at docket number

      retry(() => {
        cy.get('[data-testid="keyword-search-input"]').clear();
        cy.get('[data-testid="keyword-search-input"]').type(uniqueString);
        cy.get('[data-testid="submit-order-advanced-search-button"]').click();
        return cy.get('body').then(body => {
          return (
            body.find(`[data-testid="docket-number-${docketNumber}"]`)
              .length === 1
          );
        });
      });
    });
  });

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
