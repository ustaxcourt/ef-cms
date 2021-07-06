exports.navigateTo = (username, docketNumber) => {
  cy.login(username, `/case-detail/${docketNumber}/petition-qc`);
};

exports.navigateToCase = (username, docketNumber) => {
  cy.login(username, `/case-detail/${docketNumber}`);
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

exports.getIrsNoticeTab = () => {
  return cy.get('button#tab-irs-notice');
};

exports.getHasIrsNoticeYesRadioButton = () => {
  return cy.get('#has-irs-verified-notice-yes');
};

exports.getReviewPetitionButton = () => {
  return cy.contains('button', 'Review Petition');
};

exports.getSaveForLaterButton = () => {
  return cy.contains('button', 'Save for Later');
};
