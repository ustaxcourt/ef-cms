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
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(10000);

  cy.get('body').then(body => {
    if (body.find('div.dynamsoft-dialog-close').length > 0) {
      cy.get('div.dynamsoft-dialog-close').click();
    }
  });
};
