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

exports.getSignatureWarningContaining = text => {
  return cy.contains('span#signature-warning', text);
};

exports.getCaseDetailTab = tabName => {
  // tabName can be: docket-record, tracked-items, drafts, correspondence, case-information, case-messages, notes
  return cy.get(`button#tab-${tabName}`);
};

exports.getActionMenuSubMenuButton = buttonName => {
  return cy.get(`li#menu-button-${buttonName}`);
};

exports.selectOrderTypeOption = index => {
  const eventCodeSelect = 'select[name=eventCode]';

  return cy
    .get(`${eventCodeSelect} > option`)
    .eq(index)
    .then(option => cy.get(`${eventCodeSelect}`).select(option.val()));
};

exports.getApplySignatureButton = () => {
  return cy.contains('a', 'Apply Signature');
};

exports.moveSignatureToBottomOfPdf = () => {
  return cy
    .get('#signature-warning')
    .realHover()
    .should('have.css', 'color', 'rgb(255, 0, 0)');
};

exports.getSnapshot = area => {
  cy.get(area).matchImageSnapshot(area);
};
