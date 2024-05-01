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
