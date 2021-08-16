const faker = require('faker');

faker.seed(faker.datatype.number());

exports.gotoAdvancedSearch = () => {
  cy.get('a.advanced').click();
};

exports.gotoAdvancedPractitionerSearch = () => {
  cy.get('a.advanced').click();
  cy.get('button#tab-practitioner').click();
};

exports.goToOrderSearch = () => {
  cy.get('a.advanced').click();
  cy.get('button#tab-order').click();
};

exports.goToOpinionSearch = () => {
  cy.get('a.advanced').click();
  cy.get('button#tab-opinion').click();
};

exports.searchByPetitionerName = petitionerName => {
  cy.get('input#petitioner-name').type(petitionerName);
  cy.get('button#advanced-search-button').click();
  cy.get('table.search-results').should('exist');
};

exports.searchByDocketNumber = docketNumber => {
  cy.get('input#docket-number').type(docketNumber);
  cy.get('button#docket-search-button').click();
  cy.url().should('contain', docketNumber);
};

exports.searchByPractitionerName = () => {
  cy.get('input#practitioner-name').type('test');
  cy.get('button#practitioner-search-by-name-button').click();
  cy.get('table.search-results').should('exist');
};

exports.searchByPractitionerbarNumber = barNumber => {
  cy.get('input#bar-number').type(barNumber);
  cy.get('button.advanced-search__button').eq(1).click();
  cy.url().should('contain', barNumber);
};

exports.searchOrderByKeyword = keyword => {
  cy.get('input#order-search').type(keyword);
  cy.get('button#advanced-search-button').click();
  cy.get('table.search-results').should('exist');
};

exports.searchOpinionByKeyword = keyword => {
  cy.get('input#opinion-search').type(keyword);
  cy.get('button#advanced-search-button').click();
  cy.get('table.search-results').should('exist');
};

exports.createOpinion = () => {
  cy.get('#case-detail-menu-button').click();
  cy.get('#menu-button-upload-pdf').click();
  cy.get('#upload-description').type('A Smoketest Opinion');
  cy.get('inputprimary-document-file').attachFile(
    '../../fixtures/w3-dummy.pdf',
  );
  cy.get('#save-uploaded-pdf-button').scrollIntoView().click();
};

exports.addDocketEntryAndServeOpinion = testData => {
  cy.get('div.document-viewer--documents-list:last-child').click();
  cy.get('#add-court-issued-docket-entry-button').click();
  cy.url().should('contain', '/add-court-issued-docket-entry');
  cy.get('#document-type').children().first().click();
  cy.get('div.select-react-element__menu-list')
    .find('div')
    .contains('Memorandum Opinion')
    .click();
  cy.get('#judge').select('Foley');

  testData.documentDescription = faker.company.catchPhrase();
  cy.get('#free-text').type(testData.documentDescription);

  cy.get('#serve-to-parties-btn').click();
  cy.get('button').contains('Yes, Serve').click();
  cy.get('#print-paper-service-done-button').click();
  cy.get(
    '#case-detail-internal > div.usa-alert.usa-alert--success.usa-alert-success-message-only',
  ).should('exist');
};
