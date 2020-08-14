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

exports.getSaveButton = () => {
  return cy.contains('button', 'Save');
};

exports.getCaseTitleContaining = text => {
  return cy.contains('p#case-title', text);
};

exports.getCaseDetailTab = tabName => {
  // tabName can be: docket-record, tracked-items, drafts, correspondence, case-information, case-messages, notes
  return cy.get(`button#tab-${tabName}`);
};
