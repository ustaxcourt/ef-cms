export const goToCaseDetailPetitioner = docketNumber => {
  cy.get('#docket-search-field').clear().type(docketNumber);
  cy.get('.usa-search-submit-text').click();
  cy.get(`.big-blue-header h1 a:contains("${docketNumber}")`).should('exist');
};

export const goToFileADocument = () => {
  cy.get('a#button-file-document').click();
};

export const goToSelectDocumentType = () => {
  cy.get('a[href*="/file-a-document"]').scrollIntoView().click();
};

export const goToFileYourDocument = () => {
  cy.get('button#submit-document').click();
};

export const goToReviewDocument = exports.goToFileYourDocument;

export const uploadDocumentFile = () => {
  cy.get('#primary-document').attachFile('../fixtures/w3-dummy.pdf');
};

export const submitDocument = () => {
  cy.get('button#submit-document').click();

  cy.get('div.usa-alert--success').should('exist');
};
