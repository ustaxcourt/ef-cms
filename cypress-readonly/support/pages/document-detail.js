exports.navigateTo = (username, docketNumber, docketEntryId) => {
  cy.login(username, `/case-detail/${docketNumber}/documents/${docketEntryId}`);
};

exports.getMessagesTab = () => {
  return cy.get('button#tab-pending-messages');
};

exports.getInProgressTab = () => {
  return cy.get('button#tab-messages-in-progress');
};

exports.getCreateMessageButton = () => {
  return cy.get('button#create-message-button');
};

exports.getSectionSelect = () => {
  return cy.get('select#section');
};

exports.getAssigneeIdSelect = () => {
  return cy.get('select#assigneeId');
};

exports.getMessageTextArea = () => {
  return cy.get('textarea#message');
};

exports.getSendMessageButton = () => {
  return cy.get('.modal-dialog').contains('Send');
};

exports.getCardContaining = text => {
  return cy.get('.card').contains(text);
};

exports.getModal = () => {
  return cy.get('.modal-dialog');
};
