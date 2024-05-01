import { ADVANCED_SEARCH_OPINION_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';

export const navigateTo = () => {
  cy.visit('/');
};

export const clickOnSearchTab = tabName => {
  cy.get(`button#tab-${tabName}`).click();
};

export const searchForCaseByDocketNumber = docketNumber => {
  cy.get('input#docket-number').type(docketNumber);
  cy.get('button#docket-search-button').click();
};

export const enterPetitionerName = (name: string) => {
  cy.waitUntilSettled();
  cy.get('[data-testid="petitioner-name"]').type(name);
};

export const getPetitionerNameInput = () => {
  return cy.get('[data-testid="petitioner-name"]');
};

export const enterCaseTitleOrPetitionerName = name => {
  cy.get('input#title-or-name').type(name);
};

export const getCaseTitleOrPetitionerNameInput = () => {
  return cy.get('input#title-or-name');
};

export const enterDocumentKeywordForAdvancedSearch = keyword => {
  cy.get('input#keyword-search').type(keyword);
};

export const getKeywordInput = () => {
  return cy.get('input#keyword-search');
};

export const enterDocumentDocketNumber = docketNumber => {
  cy.waitUntilSettled();
  cy.get('input#docket-number').type(docketNumber);
};

export const getDocketNumberInput = () => {
  return cy.get('input#docket-number');
};

export const unselectOpinionTypesExceptBench = () => {
  let opinionTypes = Object.keys(ADVANCED_SEARCH_OPINION_TYPES).filter(
    type => type !== 'Bench',
  );

  opinionTypes.forEach(opinionType => {
    cy.get('label').contains(opinionType).click();
  });
};

export const searchForCaseByPetitionerInformation = () => {
  cy.get('button#advanced-search-button').click();
};

export const searchForDocuments = () => {
  cy.get('button#advanced-search-button').click();
};

export const noSearchResultsContainer = () => {
  return cy.get('div#no-search-results');
};

export const searchResultsTable = () => {
  return cy.get('table.search-results');
};

export const firstSearchResultJudgeField = () => {
  return cy.contains('td', 'Foley');
};

export const docketRecordTable = () => {
  return cy.get('table#docket-record-table');
};

export const searchForOrderByJudge = judge => {
  return cy.get('#order-judge').select(judge);
};

export const publicHeader = () => {
  return cy.get('h1.header-welcome-public');
};

export const petitionHyperlink = () => {
  return cy.get('button.view-pdf-link').contains('Petition');
};
