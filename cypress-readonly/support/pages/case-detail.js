exports.navigateTo = (username, docketNumber) => {
  cy.login(username, `/case-detail/${docketNumber}`);
};

exports.getActionMenuButton = () => {
  return cy.get('button.case-detail-menu__button');
};

exports.getEditCaseCaptionButton = () => {
  return cy.get('button#menu-edit-case-context-button');
};

exports.getCaptionTextArea = () => {
  return cy.get('textarea.caption');
};

exports.getButton = buttonText => {
  return cy.contains('button', buttonText);
};

exports.getCaseTitleContaining = text => {
  return cy.contains('p#case-title', text);
};

exports.getCaseDetailTab = tabName => {
  // tabName can be: docket-record, tracked-items, drafts, correspondence, case-information, case-messages, notes
  return cy.get(`button#tab-${tabName}`);
};

exports.hoverOverSignatureWarning = () => {
  return cy.get('#signature-warning').realHover();
};

exports.createOrder = docketNumber => {
  cy.goToRoute(
    `/case-detail/${docketNumber}/create-order?documentTitle=Order to Show Cause&documentType=Order to Show Cause&eventCode=OSC`,
  );
  cy.url().should('contain', '/create-order');
  cy.get('.ql-editor').type('A created order!');
  cy.get('#save-order-button').click();
  cy.url().should('contain', '/sign');
};
