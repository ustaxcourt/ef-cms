export const navigateTo = (username, docketNumber) => {
  cy.login(username, `/case-detail/${docketNumber}/petition-qc`);
};

export const navigateToCase = (username, docketNumber) => {
  cy.login(username, `/case-detail/${docketNumber}`);
};

export const getCaseInfoTab = () => {
  return cy.get('button#tab-case-info');
};

export const getCaseTitleTextArea = () => {
  return cy.get('textarea#case-caption');
};

export const getCaseTitleContaining = text => {
  return cy.contains('p#case-title', text);
};

export const getIrsNoticeTab = () => {
  return cy.get('button#tab-irs-notice');
};

export const getHasIrsNoticeYesRadioButton = () => {
  return cy.get('#has-irs-verified-notice-yes');
};

export const getReviewPetitionButton = () => {
  return cy.contains('button', 'Review Petition');
};

export const getSaveForLaterButton = () => {
  return cy.contains('button', 'Save for Later');
};
