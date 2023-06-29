export const navigateTo = (username, docketNumber) => {
  cy.login(username, `/case-detail/${docketNumber}`);
};

export const getActionMenuButton = () => {
  return cy.get('button.case-detail-menu__button');
};

export const getEditCaseCaptionButton = () => {
  return cy.get('button#menu-edit-case-context-button');
};

export const getCaptionTextArea = () => {
  return cy.get('textarea.caption');
};

export const getButton = buttonText => {
  return cy.contains('button', buttonText);
};

export const getCaseTitleContaining = text => {
  return cy.contains('p#case-title', text);
};

export const getCaseDetailTab = tabName => {
  // tabName can be: docket-record, tracked-items, drafts, correspondence, case-information, case-messages, notes
  return cy.get(`button#tab-${tabName}`);
};

export const createOrder = docketNumber => {
  cy.goToRoute(
    `/case-detail/${docketNumber}/create-order?documentTitle=Order to Show Cause&documentType=Order to Show Cause&eventCode=OSC`,
  );
  cy.url().should('contain', '/create-order');
  cy.get('.ql-editor').type('A created order!');
  cy.get('#save-order-button').click();
  cy.url().should('contain', '/sign');
};
