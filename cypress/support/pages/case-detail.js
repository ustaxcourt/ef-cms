exports.navigateTo = (username, caseId) => {
  cy.login(username, `/case-detail/${caseId}`);
};

exports.getActionMenuButton = () => {
  return cy.get('button.case-detail-menu__button');
};

exports.getEditCaseCaptionButton = () => {
  return cy.get('button#edit-case-context-button');
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
