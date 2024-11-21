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

describe('Docket record sort', () => {
  before(() => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      cy.wrap(docketNumber).as('DOCKET_NUMBER');
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
    });
  });

  beforeEach(() => {
    cy.reload(true);
    cy.keepAliases();
  });

  it('should display docket entries in default sort order', () => {
    getColumnTextFields('docket-entry-filedDate').then(columnTextFields => {
      const sortedColumnsTextFieldsAsc = [...columnTextFields].sort(
        sortColumnsAsc,
      );

      expect(columnTextFields).to.deep.equal(sortedColumnsTextFieldsAsc);
    });
  });

  [
    {
      columnId: 'docket-entry-index',
      fieldName: 'index',
      sortButtonId: 'index-sortable-button',
    },
    {
      columnId: 'docket-entry-filedDate',
      defaultSort: true,
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
  ].forEach(testInfo => {
    it(`should display docket entries in correct order when sorting by ${testInfo.fieldName} ascending and descending`, () => {
      if (!testInfo.defaultSort) {
        cy.get(`[data-testid="${testInfo.sortButtonId}"]`).click();
      }
      getColumnTextFields(testInfo.columnId).then(columnTextFields => {
        const sortedColumnsTextFieldsAsc = [...columnTextFields].sort(
          sortColumnsAsc,
        );

        expect(columnTextFields).to.deep.equal(sortedColumnsTextFieldsAsc);
      });

      cy.get(`[data-testid="${testInfo.sortButtonId}"]`).click();

      getColumnTextFields(testInfo.columnId).then(columnTextFields => {
        const sortedColumnsTextFieldsDesc = [...columnTextFields]
          .sort(sortColumnsAsc)
          .reverse();
        expect(columnTextFields).to.deep.equal(sortedColumnsTextFieldsDesc);
      });
    });
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      cy.viewport('iphone-5');
    });
    it('should update the dropdown value when user selects an option', () => {
      cy.get('[data-testid="docket-record-sort-select"]').should(
        'have.value',
        'byDate',
      );
      cy.get('[data-testid="docket-record-sort-select"]').select('byIndexDesc');
      cy.get('[data-testid="docket-record-sort-select"]').should(
        'have.value',
        'byIndexDesc',
      );
    });
  });
});

const getColumnTextFields = (dataTestId: string) => {
  return cy.get(`[data-testid^="${dataTestId}"]`).then($cells => {
    return $cells.toArray().map(cell => cell.innerText);
  });
};

function sortColumnsAsc(a: string, b: string) {
  const getPriority = (value: string) => {
    if (value === '') return 1;
    if (value?.toLocaleLowerCase() === 'not served') return 2;
    return 0;
  };

  const priorityA = getPriority(a);
  const priorityB = getPriority(b);

  if (priorityA !== priorityB) return priorityA - priorityB;
  return a.localeCompare(b);
}
