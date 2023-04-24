export const navigateTo = () => {
  cy.visit('/');
};

export const searchForCaseByDocketNumber = docketNumber => {
  cy.get('input#docket-number').type(docketNumber);
  cy.get('button#docket-search-button').click();
};

export const enterPetitionerName = name => {
  cy.get('input#petitioner-name').type(name);
};

export const noSearchResultsContainer = () => {
  return cy.get('div#no-search-results');
};

export const searchResultsTable = () => {
  return cy.get('table.search-results');
};

export const docketRecordTable = () => {
  return cy.get('table#docket-record-table');
};
