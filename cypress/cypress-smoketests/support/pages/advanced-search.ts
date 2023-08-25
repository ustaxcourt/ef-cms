import { faker } from '@faker-js/faker';

faker.seed(faker.number.int());

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
  cy.get('input#petitioner-name').clear();
  cy.get('input#petitioner-name').type(petitionerName);
  cy.get('button#advanced-search-button').click();
  cy.get('table.search-results').should('exist');
};

export const searchByDocketNumber = docketNumber => {
  cy.get('input#docket-number').clear();
  cy.get('input#docket-number').type(docketNumber);
  cy.get('button#docket-search-button').click();
  cy.url().should('contain', docketNumber);
};

export const searchByPractitionerName = () => {
  cy.get('input#practitioner-name').clear();
  cy.get('input#practitioner-name').type('test');
  cy.get('button#practitioner-search-by-name-button').click();
  cy.get('table.search-results').should('exist');
};

export const searchByPractitionerbarNumber = barNumber => {
  cy.get('input#bar-number').clear();
  cy.get('input#bar-number').type(barNumber);
  cy.get('button.advanced-search__button').eq(1).click();
  cy.url().should('contain', barNumber);
};

export const searchOrderByKeyword = keyword => {
  cy.get('input#keyword-search').clear();
  cy.get('input#keyword-search').type(keyword);
  cy.get('button#advanced-search-button').click();
  cy.get('table.search-results').should('exist');
};

export const searchOpinionByKeyword = keyword => {
  cy.get('input#keyword-search').clear();
  cy.get('input#keyword-search').type(keyword);
  cy.get('button#advanced-search-button').click();
  cy.get('table.search-results').should('exist');
};

export const createOpinion = () => {
  cy.get('#case-detail-menu-button').click();
  cy.get('#menu-button-upload-pdf').click();
  cy.get('#upload-description').type('A Smoketest Opinion');
  cy.get('input#primary-document-file').attachFile('../fixtures/w3-dummy.pdf');
  cy.get('#save-uploaded-pdf-button').scrollIntoView();

  // Flaky test fix; attempting to wait 0ms to allow event loop to proceed
  // https://github.com/flexion/ef-cms/issues/10135
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(0);
  cy.get('#save-uploaded-pdf-button').click();
};

export const addDocketEntryAndServeOpinion = testData => {
  cy.get('div.document-viewer--documents-list:last-child').click();
  cy.get('#add-court-issued-docket-entry-button').click();
  cy.url().should('contain', '/add-court-issued-docket-entry');
  cy.get('div#document-type').type('Memorandum Opinion{enter}');

  cy.get('#judge').select('Foley');

  testData.documentDescription = faker.company.catchPhrase();
  cy.get('#free-text').clear();
  cy.get('#free-text').type(testData.documentDescription);

  cy.get('#serve-to-parties-btn').click();
  cy.get('#modal-button-confirm').click();
  cy.get('#print-paper-service-done-button').click();
  cy.get(
    '#case-detail-internal > div.usa-alert.usa-alert--success.usa-alert-success-message-only',
  ).should('exist');
};
