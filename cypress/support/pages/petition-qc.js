exports.navigateTo = (username, caseId) => {
  cy.login(username, `/case-detail/${caseId}/petition-qc`);
};

exports.getCaseInfoTab = () => {
  return cy.get('button#tab-case-info');
};

exports.getCaseTitleTextArea = () => {
  return cy.get('textarea#case-caption');
};

exports.getCaseTitleContaining = text => {
  return cy.contains('p#case-title', text);
};

exports.getReviewPetitionButton = () => {
  return cy.contains('button', 'Review Petition');
};

exports.getSaveForLaterButton = () => {
  return cy.contains('button', 'Save for Later');
};
