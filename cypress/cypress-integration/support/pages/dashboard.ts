export const navigateTo = username => {
  cy.login(username, '/');
};

export const viewMyOutbox = () => {
  cy.get('button#individual-sent-tab').click();
};

export const viewSectionOutbox = () => {
  cy.get('button.button-switch-box').click();
  cy.get('button#section-sent-tab').click();
};

export const viewDocumentQCSectionInbox = () => {
  cy.visit('/document-qc/section/inbox');
};

export const getWorkItemContaining = text => {
  return cy.contains(text);
};

export const getTableRows = () => {
  return cy.get('tbody');
};

export const getWorkItemCheckboxLabel = workItemId => {
  return cy.get(`label#label-${workItemId}`);
};

export const getSectionUsersSelect = () => {
  return cy.get('select#options');
};

export const selectAssignee = user => {
  cy.intercept('PUT', '/work-items').as('assignWorkItem');
  getSectionUsersSelect().select(user);
  cy.wait('@assignWorkItem');
};

export const getWorkItemRow = docketNumber => {
  return cy.contains('tr', docketNumber);
};

export const getSendButton = () => {
  return cy.contains('button', 'Send');
};

export const getCaseStatusFilter = () => {
  return cy.get('select#caseStatusFilter');
};

export const selectsCaseStatusFilterNew = () => {
  getCaseStatusFilter().select('New');
};

export const messagesShouldBeFiltered = () => {
  return cy.get('table').contains('td', 'Calendared').should('not.exist');
};
