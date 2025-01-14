import {
  createAndServePaperPetition,
  createAndServePaperPetitionMyselfAndSpouse,
} from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import {
  docketRecordTable,
  enterDocumentDocketNumber,
  enterDocumentKeywordForAdvancedSearch,
  firstSearchResultJudgeField,
  navigateTo as navigateToDashboard,
  noSearchResultsContainer,
  searchForCaseByDocketNumber,
  searchForDocuments,
  searchForOrderByJudge,
  searchResultsTable,
  unselectOpinionTypesExceptBench,
} from '../../../support/pages/public/advanced-search';
import { faker } from '@faker-js/faker';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { loginAsDocketClerk1 } from '../../../../helpers/authentication/login-as-helpers';

describe('Advanced search', () => {
  describe('Case Search By Name', () => {
    it('should show order search results by [petitioner name, secondary contact name, case caption] when searching', () => {
      const nameToSearchFor = `${faker.person.firstName()} ${faker.person.lastName()}`;
      createAndServePaperPetition({ name: nameToSearchFor }).then(
        ({ docketNumber: primaryContactDocketNumber }) => {
          createAndServePaperPetitionMyselfAndSpouse({
            secondaryContactName: nameToSearchFor,
          }).then(({ docketNumber: secondaryContactDocketNumber }) => {
            createAndServePaperPetition().then(
              ({ docketNumber: caseCaptionDocketNumber }) => {
                const updatedCaseCaption = `${nameToSearchFor}, name on caseCaption, third-best match, Petitioner`;
                loginAsDocketClerk1();
                goToCase(caseCaptionDocketNumber);
                cy.get('[data-testid=tab-case-information]').click();
                cy.get('[data-testid=menu-edit-case-context-button]').click();
                cy.get('[data-testid=edit-case-caption-textarea]').clear();
                cy.get('[data-testid=edit-case-caption-textarea]').type(
                  updatedCaseCaption,
                );
                cy.get('[data-testid="modal-button-confirm"]').click();
                cy.get('[data-testid="success-alert"]').should('be.visible');

                cy.visit('/');
                cy.get('[data-testid=petitioner-name]').type(nameToSearchFor);
                cy.get(
                  '[data-testid=submit-case-search-by-name-button]',
                ).click();

                cy.get(
                  //7355: Primary contact Name is most important
                  `[data-testid=advanced-case-search-result-${primaryContactDocketNumber}]`,
                ).find(`[data-testid=advanced-case-search-result-order-${0}]`);
                cy.get(
                  //7355: Secondary contact name is second most important
                  `[data-testid=advanced-case-search-result-${secondaryContactDocketNumber}]`,
                ).find(`[data-testid=advanced-case-search-result-order-${1}]`);
                cy.get(
                  //7355: Case caption is third most important
                  `[data-testid=advanced-case-search-result-${caseCaptionDocketNumber}]`,
                ).find(`[data-testid=advanced-case-search-result-order-${2}]`);
              },
            );
          });
        },
      );
    });
  });

  describe('case - by docket number', () => {
    it('should display "No Matches Found" when case search yields no results', () => {
      navigateToDashboard();
      searchForCaseByDocketNumber('999-99');
      expect(noSearchResultsContainer()).to.exist;
    });

    it('should route to case detail when a case search match is found', () => {
      navigateToDashboard();
      searchForCaseByDocketNumber('103-20');
      expect(docketRecordTable()).to.exist;
    });
  });

  describe('opinion', () => {
    it('should display results when a keyword and docketNumberWithSuffix is provided', () => {
      navigateToDashboard();
      cy.get('[data-testid="opinion-search-tab"]').click();
      enterDocumentKeywordForAdvancedSearch('opinion');
      enterDocumentDocketNumber('124-20L');
      searchForDocuments();
      expect(searchResultsTable()).to.exist;
    });

    it('should display results with a judge name', () => {
      navigateToDashboard();
      cy.get('[data-testid="opinion-search-tab"]').click();
      enterDocumentDocketNumber('107-19');

      unselectOpinionTypesExceptBench();
      searchForDocuments();

      expect(searchResultsTable()).to.exist;
      expect(firstSearchResultJudgeField()).to.exist;
    });
  });

  describe('order', () => {
    it('should be able to search for an order by legacy judge', () => {
      const judgeNameColumnIndex = 5;
      const wantedLegacyJudge = 'Fieri';

      navigateToDashboard();
      cy.get('[data-testid="order-search-tab"]').click();
      searchForOrderByJudge(wantedLegacyJudge);
      searchForDocuments();

      expect(searchResultsTable()).to.exist;

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
});
