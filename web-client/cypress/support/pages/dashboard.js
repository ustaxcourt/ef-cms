exports.navigateTo = username => {
  cy.login(username, '/');
};

exports.viewMyOutbox = () => {
  cy.get('button#tab-my-queue').click();
  cy.get('button#individual-sent-tab').click();
};

exports.viewMyInbox = () => {
  cy.get('button#tab-my-queue').click();
  cy.get('button#individual-inbox-tab').click();
};

exports.viewSectionInbox = () => {
  cy.get('button#tab-work-queue').click();
  cy.get('button#section-inbox-tab').click();
};

exports.viewSectionOutbox = () => {
  cy.get('button#tab-work-queue').click();
  cy.get('button#section-sent-tab').click();
};

exports.getWorkItemContaining = text => {
  return cy.contains(text);
};

exports.getTableRows = () => {
  return cy.get('table').find('tbody');
};
