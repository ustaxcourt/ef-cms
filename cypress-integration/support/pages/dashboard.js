const { DAWSON_GLOBAL_DISABLED_AXE_ERRORS } = require('../axe');

exports.navigateTo = username => {
  cy.login(username, '/');

  cy.waitUntilSettled();

  cy.injectAxe();
  cy.checkA11y('html', {
    rules: {
      //disabling this because app.jsx > AppComponent > CurrentPage components have headings
      'page-has-heading-one': { enabled: false },
      ...DAWSON_GLOBAL_DISABLED_AXE_ERRORS,
    },
  });
};

exports.viewMyOutbox = () => {
  cy.get('button#individual-sent-tab').click();
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
  cy.intercept('PUT', '/work-items').as('assignWorkItem');
  exports.getSectionUsersSelect().select(user);
  cy.wait('@assignWorkItem');
};

exports.getWorkItemRow = docketNumber => {
  return cy.contains('tr', docketNumber);
};

exports.getSendButton = () => {
  return cy.contains('button', 'Send');
};
