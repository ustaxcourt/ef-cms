import {
  clickOnSearchTab,
  docketRecordTable,
  enterDocumentDocketNumber,
  enterDocumentKeywordForAdvancedSearch,
  enterPetitionerName,
  firstSearchResultJudgeField,
  navigateTo as navigateToDashboard,
  noSearchResultsContainer,
  searchForCaseByDocketNumber,
  searchForCaseByPetitionerInformation,
  searchForDocuments,
  searchForOrderByJudge,
  searchResultsTable,
  unselectOpinionTypesExceptBench,
} from '../../support/pages/public/advanced-search';

describe('Advanced search', () => {
  describe('case - by name', () => {
    it('should route to case detail when a match is found and the user clicks on the docket record link in the table', () => {
      navigateToDashboard();
      enterPetitionerName('Osborne');
      searchForCaseByPetitionerInformation();
      expect(searchResultsTable()).to.exist;
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
      clickOnSearchTab('opinion');
      enterDocumentKeywordForAdvancedSearch('opinion');
      enterDocumentDocketNumber('124-20L');
      searchForDocuments();
      expect(searchResultsTable()).to.exist;
    });

    it('should display results with a judge name', () => {
      navigateToDashboard();
      clickOnSearchTab('opinion');
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
      clickOnSearchTab('order');
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
