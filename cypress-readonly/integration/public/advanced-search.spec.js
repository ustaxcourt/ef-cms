const {
  docketRecordTable,
  enterPetitionerName,
  navigateTo: navigateToDashboard,
  noSearchResultsContainer,
  searchForCaseByDocketNumber,
  searchForCaseByPetitionerInformation,
  searchResultsTable,
} = require('../../support/pages/public/advanced-search');

describe('Public UI Smoketests', () => {
  describe('case - by name', () => {
    it('should route to case detail when a match is found and the user clicks on the docket record link in the table', () => {
      navigateToDashboard();
      enterPetitionerName('Smith');
      searchForCaseByPetitionerInformation();
      expect(searchResultsTable()).to.exist;
    });
  });

  describe('case - by docket number', () => {
    it('should display "No Matches Found" when case search yields no results', () => {
      navigateToDashboard();
      searchForCaseByDocketNumber('99-21');
      expect(noSearchResultsContainer()).to.exist;
    });

    it('should route to case detail when a case search match is found', () => {
      navigateToDashboard();
      searchForCaseByDocketNumber('101-21');
      expect(docketRecordTable()).to.exist;

      cy.get('button#printable-docket-record-button').click();

      cy.get('a.modal-button-confirm')
        .invoke('attr', 'href')
        .then(href => {
          cy.request({
            followRedirect: true,
            method: 'GET',
            url: href,
          }).should(response => {
            expect(response.status).to.equal(200);
          });
        });
    });
  });
});
