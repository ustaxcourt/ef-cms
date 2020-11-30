exports.goToCreateCase = () => {
  cy.get('a#file-a-petition').click();
};

exports.goToReviewCase = testData => {
  cy.server();
  cy.route('POST', '**/paper').as('postPaperCase');
  cy.get('button#submit-case').scrollIntoView().click();
  cy.wait('@postPaperCase');
  cy.get('@postPaperCase').should(xhr => {
    expect(xhr.responseBody).to.have.property('docketNumber');
    if (testData) {
      testData.createdPaperDocketNumber = xhr.responseBody.docketNumber;
    }
  });
};

exports.saveCaseForLater = () => {
  cy.get('button:contains("Save for Later")').click();
};

exports.serveCaseToIrs = () => {
  cy.get('#ustc-start-a-case-form button#submit-case').scrollIntoView().click();
  cy.get('button#confirm').scrollIntoView().click();
};

exports.closeScannerSetupDialog = () => {
  cy.server();
  cy.intercept('webtwain.install.js').as('getDynamsoft');
  cy.wait('@getDynamsoft');
  // the dynamsoft popup doesn't show immediately after the last script has been downloaded
  cy.wait(2000); // eslint-disable-line cypress/no-unnecessary-waiting
  cy.get('body').then(body => {
    if (body.find('div.dynamsoft-backdrop').length > 0) {
      cy.get('div.dynamsoft-dialog-close').click();
      cy.get('div.dynamsoft-backdrop').should('not.exist');
    }
  });
};
