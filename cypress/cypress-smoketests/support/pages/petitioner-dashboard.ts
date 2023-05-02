export const goToCaseDetail = caseTitle => {
  cy.get(`td:contains(${caseTitle})`)
    .first()
    .parent()
    .find('a[href*="case-detail/"]')
    .first()
    .click();
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
