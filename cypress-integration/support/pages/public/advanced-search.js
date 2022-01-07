const {
  ADVANCED_SEARCH_OPINION_TYPES,
} = require('../../../../shared/src/business/entities/EntityConstants');

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

exports.getPetitionerNameInput = () => {
  return cy.get('input#petitioner-name');
};

exports.enterCaseTitleOrPetitionerName = name => {
  cy.get('input#title-or-name').type(name);
};

exports.getCaseTitleOrPetitionerNameInput = () => {
  return cy.get('input#title-or-name');
};

exports.enterDocumentKeywordForAdvancedSearch = keyword => {
  cy.get('input#keyword-search').type(keyword);
};

exports.getKeywordInput = () => {
  return cy.get('input#keyword-search');
};

exports.enterDocumentDocketNumber = docketNumber => {
  cy.get('input#docket-number').type(docketNumber);
};

exports.getDocketNumberInput = () => {
  return cy.get('input#docket-number');
};

exports.unselectOpinionTypesExceptBench = () => {
  let opinionTypes = Object.keys(ADVANCED_SEARCH_OPINION_TYPES).filter(
    type => type !== 'Bench',
  );

  opinionTypes.forEach(opinionType => {
    cy.get('label').contains(opinionType).click();
  });
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

exports.firstSearchResultJudgeField = () => {
  return cy.contains('td', 'Foley');
};

exports.docketRecordTable = () => {
  return cy.get('table#docket-record-table');
};

exports.searchForOrderByJudge = judge => {
  return cy.get('#order-judge').select(judge);
};

exports.publicHeader = () => {
  return cy.get('h1.header-welcome-public');
};

exports.petitionHyperlink = () => {
  return cy.get('button.view-pdf-link').contains('Petition');
};
