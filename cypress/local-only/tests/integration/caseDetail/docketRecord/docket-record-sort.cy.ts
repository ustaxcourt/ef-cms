import { createAndSaveForLaterPaperFiling } from '../../../../../helpers/caseDetail/docketRecord/paperFiling/create-and-save-for-later-paper-filing';
import { createAndServePaperFiling } from '../../../../../helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { externalUserCreatesElectronicCase } from '../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsPetitioner,
} from '../../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../../helpers/authentication/logout';
import { petitionsClerkServesPetition } from '../../../../../helpers/documentQC/petitionsclerk-serves-petition';

type DocketRecordSortTest = {
  columnId: string;
  fieldName: string;
  sortButtonId: string;
};

const docketRecordSortTests: DocketRecordSortTest[] = [
  {
    columnId: 'docket-entry-index',
    fieldName: 'index',
    sortButtonId: 'index-sortable-button',
  },
  {
    columnId: 'docket-entry-filedDate',
    fieldName: 'date',
    sortButtonId: 'sortingFilingDate-sortable-button',
  },
  {
    columnId: 'docket-entry-eventCode',
    fieldName: 'event code',
    sortButtonId: 'eventCode-sortable-button',
  },
  {
    columnId: 'docket-entry-filingsAndProceedings',
    fieldName: 'filings and proceedings',
    sortButtonId: 'descriptionDisplay-sortable-button',
  },
  {
    columnId: 'docket-entry-numberOfPages',
    fieldName: 'number of pages',
    sortButtonId: 'numberOfPages-sortable-button',
  },
  {
    columnId: 'docket-entry-filedBy',
    fieldName: 'filed by',
    sortButtonId: 'filedBy-sortable-button',
  },
  {
    columnId: 'docket-entry-action',
    fieldName: 'action',
    sortButtonId: 'action-sortable-button',
  },
  {
    columnId: 'docket-record-cell-not-served',
    fieldName: 'served',
    sortButtonId: 'servedAt-sortable-button',
  },
  {
    columnId: 'docket-entry-servedPartiesCode',
    fieldName: 'served parties',
    sortButtonId: 'servedPartiesCode-sortable-button',
  },
];

describe('Docket record sort', () => {
  it('should display the docket record in the correct order and allow mobile sort changes on a fresh case', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();
      loginAsDocketClerk();
      goToCase(docketNumber);
      createAndServePaperFiling({
        dateReceived: '01/01/2022',
        documentType: 'Motion for a New Trial',
        isPaperCase: false,
      });
      createAndSaveForLaterPaperFiling({
        dateReceived: '01/01/2022',
        documentType: 'Motion for a New Trial',
      });
      goToCase(docketNumber);
      cy.viewport('iphone-5');
      cy.get('[data-testid="docket-record-sort-select"]').should(
        'have.value',
        'byDate',
      );
      cy.get('[data-testid="docket-record-sort-select"]').select('byIndexDesc');
      cy.get('[data-testid="docket-record-sort-select"]').should(
        'have.value',
        'byIndexDesc',
      );

      cy.viewport(1200, 900);
      cy.reload(true);

      getColumnTextFields('docket-entry-filedDate').then(columnTextFields => {
        const sortedColumnsTextFieldsAsc = [...columnTextFields].sort(
          sortColumnsAsc,
        );

        expect(columnTextFields).to.deep.equal(sortedColumnsTextFieldsAsc);
      });

      docketRecordSortTests.forEach(testInfo => {
        cy.get(`[data-testid="${testInfo.sortButtonId}"]`).click();
        getColumnTextFields(testInfo.columnId).then(columnTextFields => {
          const sortedColumnsTextFieldsAsc = [...columnTextFields].sort(
            sortColumnsAsc,
          );

          expect(
            columnTextFields,
            `${testInfo.fieldName} should sort ascending`,
          ).to.deep.equal(sortedColumnsTextFieldsAsc);
        });

        cy.get(`[data-testid="${testInfo.sortButtonId}"]`).click();

        getColumnTextFields(testInfo.columnId).then(columnTextFields => {
          const sortedColumnsTextFieldsDesc = [...columnTextFields]
            .sort(sortColumnsAsc)
            .reverse();

          expect(
            columnTextFields,
            `${testInfo.fieldName} should sort descending`,
          ).to.deep.equal(sortedColumnsTextFieldsDesc);
        });
      });
    });
  });
});

const getColumnTextFields = (
  dataTestId: string,
): Cypress.Chainable<string[]> => {
  return cy.get(`[data-testid^="${dataTestId}"]`).then($cells => {
    return $cells.toArray().map(cell => cell.innerText);
  });
};

function sortColumnsAsc(a: string, b: string): number {
  const getPriority = (value: string): number => {
    if (value === '') return 1;
    if (value?.toLocaleLowerCase() === 'not served') return 2;
    return 0;
  };

  const priorityA = getPriority(a);
  const priorityB = getPriority(b);

  if (priorityA !== priorityB) return priorityA - priorityB;
  return a.localeCompare(b);
}
