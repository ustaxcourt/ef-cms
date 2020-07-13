exports.goToCreateCase = () => {
  cy.get('a#file-a-petition').click();
};

exports.goToReviewCase = () => {
  cy.get('button#submit-case').scrollIntoView().click();
};

exports.saveCaseForLater = () => {
  cy.get('button:contains("Save for Later")').click();
};

exports.serveCaseToIrs = () => {
  cy.get('#ustc-start-a-case-form button#submit-case').scrollIntoView().click();
  cy.get('button#confirm').scrollIntoView().click();
};

exports.closeScannerSetupDialog = () => {
  cy.get('div.dynamsoft-backdrop').should('exist');

  cy.get('div.dynamsoft-dialog-close').click();

  cy.get('div.dynamsoft-backdrop').should('not.exist');
};
