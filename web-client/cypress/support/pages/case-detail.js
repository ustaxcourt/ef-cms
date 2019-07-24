exports.navigateTo = (username, caseId) => {
  cy.login(username, `/case-detail/${caseId}`);
};

exports.getEditCaseCaptionButton = () => {
  return cy.get('button#caption-edit-button');
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
