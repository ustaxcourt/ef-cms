import { faker } from '@faker-js/faker';

faker.seed(faker.datatype.number());

export const gotoAdvancedSearch = () => {
  cy.get('a.advanced').click();
};

export const gotoAdvancedPractitionerSearch = () => {
  cy.get('a.advanced').click();
  cy.get('button#tab-practitioner').click();
};

export const goToOrderSearch = () => {
  cy.get('a.advanced').click();
  cy.get('button#tab-order').click();
};

export const goToOpinionSearch = () => {
  cy.get('a.advanced').click();
  cy.get('button#tab-opinion').click();
};

export const searchByPetitionerName = petitionerName => {
  cy.get('input#petitioner-name').clear().type(petitionerName);
  cy.get('button#advanced-search-button').click();
  cy.get('table.search-results').should('exist');
};

export const searchByDocketNumber = docketNumber => {
  cy.get('input#docket-number').clear().type(docketNumber);
  cy.get('button#docket-search-button').click();
  cy.url().should('contain', docketNumber);
};

export const searchByPractitionerName = () => {
  cy.get('input#practitioner-name').clear().type('test');
  cy.get('button#practitioner-search-by-name-button').click();
  cy.get('table.search-results').should('exist');
};

export const searchByPractitionerbarNumber = barNumber => {
  cy.get('input#bar-number').clear().type(barNumber);
  cy.get('button.advanced-search__button').eq(1).click();
  cy.url().should('contain', barNumber);
};

export const searchOrderByKeyword = keyword => {
  cy.get('input#keyword-search').clear().type(keyword);
  cy.get('button#advanced-search-button').click();
  cy.get('table.search-results').should('exist');
};

export const searchOpinionByKeyword = keyword => {
  cy.get('input#keyword-search').clear().type(keyword);
  cy.get('button#advanced-search-button').click();
  cy.get('table.search-results').should('exist');
};

export const createOpinion = () => {
  cy.get('#case-detail-menu-button').click();
  cy.get('#menu-button-upload-pdf').click();
  cy.get('#upload-description').type('A Smoketest Opinion');
  cy.get('input#primary-document-file').attachFile('../fixtures/w3-dummy.pdf');
  cy.get('#save-uploaded-pdf-button').scrollIntoView().click();
};

export const addDocketEntryAndServeOpinion = testData => {
  cy.get('div.document-viewer--documents-list:last-child').click();
  cy.get('#add-court-issued-docket-entry-button').click();
  cy.url().should('contain', '/add-court-issued-docket-entry');
  cy.get('div#document-type').type('Memorandum Opinion{enter}');

  cy.get('#judge').select('Foley');

  testData.documentDescription = faker.company.catchPhrase();
  cy.get('#free-text').clear().type(testData.documentDescription);

  cy.get('#serve-to-parties-btn').click();
  cy.get('#modal-button-confirm').click();
  cy.get('#print-paper-service-done-button').click();
  cy.get(
    '#case-detail-internal > div.usa-alert.usa-alert--success.usa-alert-success-message-only',
  ).should('exist');
};
