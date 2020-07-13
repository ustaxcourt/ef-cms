exports.navigateTo = username => {
  cy.login(username, '/');
};

exports.viewMyOutbox = () => {
  cy.get('button#individual-sent-tab').click();
};

exports.viewMyInbox = () => {
  cy.visit('/messages/my/inbox');
};

exports.viewSectionInbox = () => {
  cy.visit('/messages/section/inbox');
};

exports.viewSectionOutbox = () => {
  cy.get('button.button-switch-box').click();
  cy.get('button#section-sent-tab').click();
};

exports.viewDocumentQCSectionInbox = () => {
  cy.visit('/document-qc/section/inbox');
};

exports.getWorkItemContaining = text => {
  return cy.contains(text);
};

exports.getTableRows = () => {
  return cy.get('tbody');
};

exports.getWorkItemCheckboxLabel = workItemId => {
  return cy.get(`label#label-${workItemId}`);
};

exports.getSectionUsersSelect = () => {
  return cy.get('select#options');
};

exports.selectAssignee = user => {
  cy.server();
  cy.route('PUT', '/work-items').as('assignWorkItem');
  exports.getSectionUsersSelect().select(user);
  cy.wait('@assignWorkItem');
  cy.server({ enable: false });
};

exports.getWorkItemRow = docketNumber => {
  return cy.contains('tr', docketNumber);
};

exports.getSendButton = () => {
  return cy.contains('button', 'Send');
};
