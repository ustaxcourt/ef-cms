import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
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
  describe('case - by name', () => {
    it('should show a match is found when the user searches by petitioner name', () => {
      const name = `d'Artagnan ${faker.person.lastName()}`;
      createAndServePaperPetition({ name }).then(({ docketNumber }) => {
        cy.visit('/');
        cy.get('[data-testid=petitioner-name]').type(name);
        cy.get('[data-testid=submit-case-search-by-name-button]').click();
        cy.get(
          `[data-testid=advanced-case-search-result-${docketNumber}]`,
        ).click();
      });
    });
  });

  describe('case - by case caption', () => {
    it('should show a match wen the user searches by case caption', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        const updatedCaseCaption = faker.word.noun();
        loginAsDocketClerk1();
        goToCase(docketNumber);
        cy.get('[data-testid=tab-case-information]').click();
        cy.get('[data-testid=menu-edit-case-context-button]').click();
        cy.get('[data-testid=edit-case-caption-textarea]').clear();
        cy.get('[data-testid=edit-case-caption-textarea]').type(
          updatedCaseCaption,
        );
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.get('[data-testid="success-alert"]').should('be.visible');
        cy.visit('/');
        cy.get('[data-testid=petitioner-name]').type(updatedCaseCaption);
        cy.get('[data-testid=submit-case-search-by-name-button]').click();
        cy.get(
          `[data-testid=advanced-case-search-result-${docketNumber}]`,
        ).click();
      });
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
