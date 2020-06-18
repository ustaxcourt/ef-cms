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
