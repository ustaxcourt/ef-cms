export const goToCreateCase = () => {
  cy.get('a#file-a-petition').click();
  cy.get('.big-blue-header').should('exist');
};

export function goToReviewCase(): Cypress.Chainable<string> {
  cy.intercept('POST', '**/paper').as('postPaperCase');
  cy.get('button#submit-case').scrollIntoView().click();
  return cy.wait('@postPaperCase').then(({ response }) => {
    return response?.body.docketNumber;
  });
}

export const saveCaseForLater = () => {
  cy.get('button:contains("Save for Later")').click();
};

export const serveCaseToIrs = () => {
  cy.get('#ustc-start-a-case-form button#submit-case').scrollIntoView().click();
  cy.get('button#confirm').scrollIntoView().click();
  cy.get('.progress-indicator').should('not.exist');
  cy.get('.big-blue-header').should('exist');
};

export const closeScannerSetupDialogIfExists = () => {
  // the dynamsoft popup doesn't show immediately after the last script has been downloaded
  cy.on('fail', err => {
    console.log(
      'encountered an error trying to close scanner setup dialog',
      err,
    );
    if (
      (err.message.includes('Timed out') &&
        err.message.includes('div.dynamsoft-dialog-close')) ||
      err.message.includes('getDynamsoft')
    ) {
      console.log('this is the error we were looking for! do not worry');
      return false;
    }
    console.log('oh no this is a bad error, we should re throw it');
    throw err;
  });

  cy.intercept('dynamsoft.webtwain.install.js?t=*').as('getDynamsoft');
  cy.wait('@getDynamsoft');

  // the dynamsoft popup doesn't show immediately after the last script has been downloaded

  cy.get('div.dynamsoft-dialog-close', { timeout: 10000 }).should('be.visible');

  cy.get('body').then(body => {
    if (body.find('div.dynamsoft-dialog-close').length > 0) {
      cy.get('div.dynamsoft-dialog-close').click();
    }
  });
};
