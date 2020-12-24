const {
  clickOnSearchTab,
  docketRecordTable,
  enterDocumentDocketNumber,
  enterDocumentKeywordForOpinionSearch,
  enterPetitionerName,
  enterStartDateForOpinionSearch,
  navigateTo: navigateToDashboard,
  noSearchResultsContainer,
  searchForCaseByDocketNumber,
  searchForCaseByPetitionerInformation,
  searchForDocuments,
  searchResultsTable,
} = require('../../support/pages/public/advanced-search');

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

  // Temporarily disabled for story 7387
  describe.skip('opinion', () => {
    it('should display results when a keyword and docketNumberWithSuffix is provided', () => {
      navigateToDashboard();
      clickOnSearchTab('opinion');
      enterDocumentKeywordForOpinionSearch('opinion');
      enterStartDateForOpinionSearch('08/03/1995');
      enterDocumentDocketNumber('124-20L');
      searchForDocuments();
      expect(searchResultsTable()).to.exist;
    });
  });
});
