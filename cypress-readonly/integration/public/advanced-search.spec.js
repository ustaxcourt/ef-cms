const {
  docketRecordTable,
  enterPetitionerName,
  navigateTo: navigateToDashboard,
  noSearchResultsContainer,
  searchForCaseByDocketNumber,
} = require('../../support/pages/public/advanced-search');
const { isValidRequest } = require('../../support/helpers');

const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

describe('Case Search Public UI Smoketests', () => {
  it('should allow the user to search for a case by petitioner name', () => {
    navigateToDashboard();
    enterPetitionerName('Smith');

    cy.intercept({
      hostname: `public-api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
      method: 'GET',
      url: '/public-api/search?**',
    }).as('getCaseByPetitionerName');

    cy.get('button#advanced-search-button').click();

    cy.wait('@getCaseByPetitionerName').then(isValidRequest);
  });

  it('should display "No Matches Found" when case search yields no results', () => {
    navigateToDashboard();
    searchForCaseByDocketNumber('99-21');
    expect(noSearchResultsContainer()).to.exist;
  });

  it('should route to case detail when a case search by docket number match is found', () => {
    navigateToDashboard();
    searchForCaseByDocketNumber('101-21');
    expect(docketRecordTable()).to.exist;
  });
});
