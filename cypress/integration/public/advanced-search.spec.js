const {
  docketRecordTable,
  navigateTo: navigateToDashboard,
  noSearchResultsContainer,
  searchForCaseByDocketNumber,
  searchForCaseByPeitionerName,
  searchResultsTable,
} = require('../../support/pages/public/advanced-search');

describe('Advanced search', () => {
  before(() => {
    cy.task('seed');
  });

  describe('case - by name', () => {
    it('should route to case detail when a match is found and the user clicks on the docket record link in the table', () => {
      navigateToDashboard();
      searchForCaseByPeitionerName('103-20');
      expect(searchResultsTable).to.exist;
    });
  });

  describe('case - by docket number', () => {
    it('should display "No Matches Found" when case search yields no results', () => {
      navigateToDashboard();
      searchForCaseByDocketNumber('999-99');
      expect(noSearchResultsContainer).to.exist;
    });

    it('should route to case detail when a case search match is found', () => {
      navigateToDashboard();
      searchForCaseByDocketNumber('103-20');
      expect(docketRecordTable).to.exist;
    });
  });
});
