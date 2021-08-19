exports.goToCreateCase = () => {
  cy.get('a#file-a-petition').click();
};

exports.goToReviewCase = testData => {
  cy.intercept('POST', '**/paper').as('postPaperCase');
  cy.get('button#submit-case').scrollIntoView().click();
  cy.wait('@postPaperCase').then(({ response }) => {
    expect(response.body).to.have.property('docketNumber');
    if (testData) {
      testData.createdPaperDocketNumber = response.body.docketNumber;
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
  cy.intercept('dynamsoft.webtwain.install.js?t=*').as('getDynamsoft');
  cy.wait('@getDynamsoft');
  // the dynamsoft popup doesn't show immediately after the last script has been downloaded
  cy.get('div.dynamsoft-dialog-close', { timeout: 10000 }).should('be.visible');

  cy.get('body').then(body => {
    if (body.find('div.dynamsoft-backdrop').length > 0) {
      cy.get('div.dynamsoft-dialog-close').click();
      cy.get('div.dynamsoft-backdrop').should('not.exist');
    }
  });
};
