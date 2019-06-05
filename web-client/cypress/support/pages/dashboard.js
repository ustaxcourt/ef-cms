exports.navigateTo = username => {
  cy.login(username, '/');
};

exports.viewMyOutbox = () => {
  cy.get('button#individual-sent-tab').click();
};

exports.viewMyInbox = () => {
  cy.visit('/messages/my/inbox');
  cy.wait(1000);
  cy.get('button#individual-inbox-tab').click();
};

exports.viewSectionInbox = () => {
  cy.get('button.button-switch-box').click();
  cy.get('button#section-inbox-tab').click();
};

exports.viewSectionOutbox = () => {
  cy.get('button.button-switch-box').click();
  cy.get('button#section-sent-tab').click();
};

exports.viewDocumentQCSectionInbox = () => {
  cy.visit('/document-qc/my/inbox');
  cy.wait(1000);
  cy.get('button.button-switch-box').click();
  cy.get('button#section-inbox-tab').click();
};

exports.getWorkItemContaining = text => {
  return cy.contains(text);
};

exports.getTableRows = () => {
  return cy.get('table').find('tbody');
};

exports.getWorkItemCheckboxLabel = workItemId => {
  return cy.get(`label#label-${workItemId}`);
};

exports.getSectionUsersSelect = () => {
  return cy.get('select#options');
};

exports.getWorkItemRow = docketNumber => {
  return cy.contains('tr', docketNumber);
};

exports.getSendButton = () => {
  return cy.contains('button', 'Send');
};

exports.getWorkItemMessages = () => {
  return cy.get('#tab-pending-messages').click();
};

exports.getWorkItemMessage = workItemId => {
  return cy.get(`div.workitem-${workItemId}`);
};
