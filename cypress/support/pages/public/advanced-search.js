exports.navigateTo = () => {
  cy.visit('/');
};

exports.clickOnSearchTab = tabName => {
  cy.get(`button#tab-${tabName}`).click();
};

exports.searchForCaseByDocketNumber = docketNumber => {
  cy.get('input#docket-number').type(docketNumber);
  cy.get('button#docket-search-button').click();
};

exports.enterPetitionerName = name => {
  cy.get('input#petitioner-name').type(name);
};

exports.enterDocumentKeywordForOpinionSearch = keyword => {
  cy.get('input#opinion-search').type(keyword);
};

exports.enterDocumentDocketNumber = docketNumber => {
  cy.get('input#docket-number').type(docketNumber);
};

exports.searchForCaseByPetitionerInformation = () => {
  cy.get('button#advanced-search-button').click();
};

exports.searchForDocuments = () => {
  cy.get('button#advanced-search-button').click();
};

exports.noSearchResultsContainer = () => {
  return cy.get('div#no-search-results');
};

exports.searchResultsTable = () => {
  return cy.get('table.search-results');
};

exports.docketRecordTable = () => {
  return cy.get('table.docket-record');
};
