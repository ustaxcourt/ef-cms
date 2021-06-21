exports.goToCaseDetail = caseTitle => {
  cy.get(`td:contains(${caseTitle})`)
    .first()
    .parent()
    .find('a[href*="case-detail/"]')
    .first()
    .click();
};

exports.goToFileADocument = () => {
  cy.get('a#button-file-document').click();
};

exports.goToSelectDocumentType = () => {
  cy.get('a[href*="/file-a-document"]').scrollIntoView().click();
};

exports.goToFileYourDocument = () => {
  cy.get('button#submit-document').click();
};
exports.goToReviewDocument = exports.goToFileYourDocument;

exports.selectDocumentType = documentType => {
  cy.get('#document-type').children().first().click();
  cy.get('div.select-react-element__menu-list')
    .find('div')
    .contains(documentType)
    .click();
};

exports.uploadDocumentFile = () => {
  cy.get('#primary-document').attachFile('../fixtures/w3-dummy.pdf');
};

exports.submitDocument = () => {
  cy.get('button#submit-document').click();

  cy.get('div.usa-alert--success').should('exist');
};
